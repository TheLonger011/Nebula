package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/TheLonger011/Nebula/internal/models"
	"github.com/TheLonger011/Nebula/internal/repository"
	"github.com/TheLonger011/Nebula/internal/service"
)

type Server struct {
	auth *service.AuthService
}

func New(authService *service.AuthService) *Server {
	return &Server{auth: authService}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth/register", s.sendCode)
	mux.HandleFunc("/api/auth/verify", s.verifyCode)
	mux.HandleFunc("/api/auth/profile", s.register)
	mux.HandleFunc("/api/auth/login", s.login)
	return s.cors(mux)
}

type codeRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type registerRequest struct {
	Email       string `json:"email"`
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
	Password    string `json:"password"`
	BirthDate   string `json:"birthDate"`
	Day         string `json:"day"`
	Month       string `json:"month"`
	Year        string `json:"year"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Login    string `json:"login"`
	Password string `json:"password"`
}

func (s *Server) sendCode(w http.ResponseWriter, r *http.Request) {
	if !method(w, r, http.MethodPost) {
		return
	}
	var input codeRequest
	if !decode(w, r, &input) {
		return
	}
	if err := s.auth.SendCode(r.Context(), input.Email); err != nil {
		s.writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *Server) verifyCode(w http.ResponseWriter, r *http.Request) {
	if !method(w, r, http.MethodPost) {
		return
	}
	var input codeRequest
	if !decode(w, r, &input) {
		return
	}
	if err := s.auth.VerifyCode(r.Context(), input.Email, input.Code); err != nil {
		s.writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "ticket": "verified"})
}

func (s *Server) register(w http.ResponseWriter, r *http.Request) {
	if !method(w, r, http.MethodPost) {
		return
	}
	var input registerRequest
	if !decode(w, r, &input) {
		return
	}
	birthDate := strings.TrimSpace(input.BirthDate)
	if birthDate == "" && input.Day != "" && input.Month != "" && input.Year != "" {
		birthDate = fmt.Sprintf("%04s-%02s-%02s", input.Year, input.Month, input.Day)
	}
	birth, err := time.Parse("2006-01-02", birthDate)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Укажите корректную дату рождения"})
		return
	}
	result, err := s.auth.Register(r.Context(), service.RegisterInput{
		Email:       input.Email,
		Username:    input.Username,
		DisplayName: input.DisplayName,
		Password:    input.Password,
		BirthDate:   birth,
		UserAgent:   r.UserAgent(),
	})
	if err != nil {
		s.writeError(w, err)
		return
	}
	s.writeAuth(w, result)
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	if !method(w, r, http.MethodPost) {
		return
	}
	var input loginRequest
	if !decode(w, r, &input) {
		return
	}
	login := input.Login
	if login == "" {
		login = input.Email
	}
	if login == "" {
		login = input.Username
	}
	result, err := s.auth.Login(r.Context(), service.LoginInput{Login: login, Password: input.Password, UserAgent: r.UserAgent()})
	if err != nil {
		s.writeError(w, err)
		return
	}
	s.writeAuth(w, result)
}

func (s *Server) writeAuth(w http.ResponseWriter, result *service.AuthResult) {
	writeJSON(w, http.StatusOK, map[string]any{
		"token":         result.AccessToken,
		"access_token":  result.AccessToken,
		"refresh_token": result.RefreshToken,
		"user":          publicUser(result.User),
	})
}

func publicUser(user *models.User) map[string]any {
	return map[string]any{
		"id":           user.ID,
		"username":     user.Username,
		"display_name": user.DisplayName,
		"birth_date":   user.BirthDate.Format("2006-01-02"),
		"avatar_url":   user.AvatarURL,
		"bio":          user.Bio,
	}
}

func (s *Server) writeError(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	message := "Внутренняя ошибка сервера"
	switch {
	case errors.Is(err, service.ErrInvalidInput):
		status, message = http.StatusBadRequest, err.Error()
	case errors.Is(err, repository.ErrEmailTaken):
		status, message = http.StatusConflict, "Эта почта уже зарегистрирована"
	case errors.Is(err, repository.ErrUsernameTaken):
		status, message = http.StatusConflict, "Этот username уже занят"
	case errors.Is(err, repository.ErrEmailNotVerified):
		status, message = http.StatusForbidden, "Сначала подтвердите почту"
	case errors.Is(err, repository.ErrCodeInvalid):
		status, message = http.StatusBadRequest, "Неверный код подтверждения"
	case errors.Is(err, repository.ErrCodeExpired):
		status, message = http.StatusBadRequest, "Код истёк. Запросите новый"
	case errors.Is(err, repository.ErrTooManyAttempts):
		status, message = http.StatusTooManyRequests, "Слишком много попыток. Запросите новый код"
	case errors.Is(err, repository.ErrTooSoon):
		status, message = http.StatusTooManyRequests, "Повторно запросить код можно через минуту"
	case errors.Is(err, service.ErrInvalidCredentials):
		status, message = http.StatusUnauthorized, "Неверные данные для входа"
	}
	writeJSON(w, status, map[string]string{"error": message})
}

func (s *Server) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "http://localhost:5173" || origin == "http://127.0.0.1:5173" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func method(w http.ResponseWriter, r *http.Request, expected string) bool {
	if r.Method == expected {
		return true
	}
	w.Header().Set("Allow", expected)
	writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "Метод не поддерживается"})
	return false
}

func decode(w http.ResponseWriter, r *http.Request, value any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	if err := json.NewDecoder(r.Body).Decode(value); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Некорректные данные запроса"})
		return false
	}
	return true
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
