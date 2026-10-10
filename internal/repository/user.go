package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/TheLonger011/Nebula/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

const userColumns = `id, username, display_name, email, password_hash, birth_date,
	avatar_url, bio, last_seen_at, email_verified_at,
	created_at, updated_at, deleted_at`

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, u *models.User) error {
	const q = `
		INSERT INTO users (username, display_name, email, password_hash, birth_date, email_verified_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	err := r.db.QueryRow(ctx, q,
		u.Username,
		u.DisplayName,
		u.Email,
		u.PasswordHash,
		u.BirthDate,
		u.EmailVerifiedAt).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			switch pgErr.ConstraintName {
			case "users_email_lower_idx":
				return ErrEmailTaken
			case "users_username_lower_idx":
				return ErrUsernameTaken
			}
		}
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

func scanUser(row pgx.Row) (*models.User, error) {
	var u models.User
	err := row.Scan(
		&u.ID,
		&u.Username,
		&u.DisplayName,
		&u.Email,
		&u.PasswordHash,
		&u.BirthDate,
		&u.AvatarURL,
		&u.Bio,
		&u.LastSeenAt,
		&u.EmailVerifiedAt,
		&u.CreatedAt,
		&u.UpdatedAt,
		&u.DeletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("scan user: %w", err)
	}
	return &u, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	const q = `
		SELECT ` + userColumns + `
		FROM users
		WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL`
	return scanUser(r.db.QueryRow(ctx, q, email))
}

func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*models.User, error) {
	const q = `
		SELECT ` + userColumns + `
		FROM users
		WHERE LOWER(username) = LOWER($1) AND deleted_at IS NULL`
	return scanUser(r.db.QueryRow(ctx, q, username))
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	const q = `
		SELECT ` + userColumns + `
		FROM users
		WHERE id = $1 AND deleted_at IS NULL`
	return scanUser(r.db.QueryRow(ctx, q, id))
}
