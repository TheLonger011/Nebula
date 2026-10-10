package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/TheLonger011/Nebula/internal/auth"
	"github.com/TheLonger011/Nebula/internal/mail"
	"github.com/TheLonger011/Nebula/internal/models"
	"github.com/TheLonger011/Nebula/internal/repository"
	"github.com/google/uuid"
	netmail "net/mail"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"
)

var ErrInvalidInput = errors.New("invalid input")

var usernameRe = regexp.MustCompile(`^[A-Za-z0-9_]{3,16}$`)

var ErrInvalidCredentials = errors.New("invalid credentials")

type LoginInput struct {
	Login     string
	Password  string
	UserAgent string
}

type AuthService struct {
	users         *repository.UserRepository
	codes         *repository.CodeRepository
	refreshTokens *repository.RefreshTokenRepository
	mailer        *mail.Mailer
	tokens        *auth.TokenManager
	refreshTTL    time.Duration
}

type RegisterInput struct {
	Email       string
	Username    string
	DisplayName string
	Password    string
	BirthDate   time.Time
	UserAgent   string
}

type AuthResult struct {
	User         *models.User
	AccessToken  string
	RefreshToken string
}

func NewAuthService(
	users *repository.UserRepository,
	codes *repository.CodeRepository,
	refreshTokens *repository.RefreshTokenRepository,
	mailer *mail.Mailer,
	tokens *auth.TokenManager,
	refreshTTL time.Duration,
) *AuthService {
	return &AuthService{
		users:         users,
		codes:         codes,
		refreshTokens: refreshTokens,
		mailer:        mailer,
		tokens:        tokens,
		refreshTTL:    refreshTTL,
	}
}

func (s *AuthService) SendCode(ctx context.Context, email string) error {
	if _, err := netmail.ParseAddress(strings.TrimSpace(email)); err != nil {
		return fmt.Errorf("%w: invalid email", ErrInvalidInput)
	}
	email = strings.ToLower(strings.TrimSpace(email))
	_, err := s.users.GetByEmail(ctx, email)
	if err == nil {
		return repository.ErrEmailTaken
	}
	if !errors.Is(err, repository.ErrNotFound) {
		return fmt.Errorf("get user: %w", err)
	}
	code, err := auth.GenerateCode()
	if err != nil {
		return fmt.Errorf("generate code: %w", err)
	}
	if err := s.codes.Save(ctx, email, code); err != nil {
		return err
	}
	if err := s.mailer.SendCode(email, code); err != nil {
		return fmt.Errorf("send code: %w", err)
	}
	return nil
}

func (s *AuthService) VerifyCode(ctx context.Context, email, code string) error {
	if err := s.codes.Verify(ctx, email, code); err != nil {
		return err
	}
	return s.codes.MarkVerified(ctx, email)
}

func (s *AuthService) issueTokens(ctx context.Context, userID uuid.UUID, userAgent string) (string, string, error) {
	access, err := s.tokens.GenerateAccess(userID)
	if err != nil {
		return "", "", fmt.Errorf("generate access: %w", err)
	}

	refresh, hash, err := auth.GenerateRefresh()
	if err != nil {
		return "", "", fmt.Errorf("generate refresh: %w", err)
	}

	err = s.refreshTokens.Create(ctx, &models.RefreshToken{
		UserID:    userID,
		TokenHash: hash,
		UserAgent: userAgent,
		ExpiresAt: time.Now().Add(s.refreshTTL),
	})
	if err != nil {
		return "", "", fmt.Errorf("save refresh token: %w", err)
	}
	return access, refresh, nil
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*AuthResult, error) {
	if err := validateRegister(input); err != nil {
		return nil, err
	}
	_, err := s.users.GetByUsername(ctx, input.Username)
	if err == nil {
		return nil, repository.ErrUsernameTaken
	}
	if !errors.Is(err, repository.ErrNotFound) {
		return nil, fmt.Errorf("get user: %w", err)
	}
	if err := s.codes.ConsumeVerified(ctx, input.Email); err != nil {
		return nil, err
	}

	hash, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}
	displayName := strings.TrimSpace(input.DisplayName)
	if displayName == "" {
		displayName = input.Username
	}
	now := time.Now()
	user := &models.User{
		Username:        input.Username,
		DisplayName:     displayName,
		Email:           strings.ToLower(strings.TrimSpace(input.Email)),
		PasswordHash:    hash,
		BirthDate:       input.BirthDate,
		EmailVerifiedAt: &now,
	}
	if err := s.users.Create(ctx, user); err != nil {
		return nil, err
	}

	access, refresh, err := s.issueTokens(ctx, user.ID, input.UserAgent)
	if err != nil {
		return nil, fmt.Errorf("issue tokens: %w", err)
	}
	return &AuthResult{
		User:         user,
		AccessToken:  access,
		RefreshToken: refresh,
	}, nil
}

func validateRegister(in RegisterInput) error {
	if _, err := netmail.ParseAddress(in.Email); err != nil || len(in.Email) > 255 {
		return fmt.Errorf("%w: invalid email", ErrInvalidInput)
	}
	if !usernameRe.MatchString(in.Username) {
		return fmt.Errorf("%w: username must be 3-16 chars: latin letters, digits, _", ErrInvalidInput)
	}
	if utf8.RuneCountInString(strings.TrimSpace(in.DisplayName)) > 64 {
		return fmt.Errorf("%w: display name is too long", ErrInvalidInput)
	}
	if utf8.RuneCountInString(in.Password) < 8 {
		return fmt.Errorf("%w: password must be at least 8 characters", ErrInvalidInput)
	}
	if in.BirthDate.IsZero() || in.BirthDate.After(time.Now()) {
		return fmt.Errorf("%w: invalid birth date", ErrInvalidInput)
	}
	return nil
}

func (s *AuthService) Login(ctx context.Context, input LoginInput) (*AuthResult, error) {
	login := strings.TrimSpace(input.Login)
	if login == "" || input.Password == "" {
		return nil, ErrInvalidCredentials
	}

	var user *models.User
	var err error
	if strings.Contains(login, "@") {
		user, err = s.users.GetByEmail(ctx, strings.ToLower(login))
	} else {
		user, err = s.users.GetByUsername(ctx, login)
	}
	if err != nil || !auth.CheckPasswordHash(input.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}
	if user.EmailVerifiedAt == nil {
		return nil, repository.ErrEmailNotVerified
	}

	access, refresh, err := s.issueTokens(ctx, user.ID, input.UserAgent)
	if err != nil {
		return nil, fmt.Errorf("issue tokens: %w", err)
	}
	return &AuthResult{User: user, AccessToken: access, RefreshToken: refresh}, nil
}
