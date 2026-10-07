package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/TheLonger011/Nebula/internal/auth"
	"github.com/TheLonger011/Nebula/internal/mail"
	"github.com/TheLonger011/Nebula/internal/repository"
	"time"
)

type AuthService struct {
	users         *repository.UserRepository
	codes         *repository.CodeRepository
	refreshTokens *repository.RefreshTokenRepository
	mailer        *mail.Mailer
	tokens        *auth.TokenManager
	refreshTTL    time.Duration
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
	return nil
}
