package mail

import (
	"errors"
	"fmt"
	"mime"
	"net/smtp"
	"strings"
)

const (
	smtpHost = "smtp.gmail.com"
	smtpPort = "587"
)

type Mailer struct {
	from     string
	password string
}

func NewMailer(from, password string) *Mailer {
	return &Mailer{from: from, password: password}
}

func (m *Mailer) SendCode(to, code string) error {
	if strings.ContainsAny(to, "\r\n") {
		return errors.New("invalid email address")
	}

	subject := mime.QEncoding.Encode("UTF-8", "код Подтвержедния Nebula")
	body := fmt.Sprintf(
		"Ваш код подтверждения: %s\r\nКод действует 10 минут.\r\n\r\nЕсли вы не запрашивали код, проигнорируйте письмо.",
		code,
	)
	msg := "From: " + m.from + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/plain; charset=UTF-8\r\n" +
		"\r\n" + body

	auth := smtp.PlainAuth("", m.from, m.password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, m.from, []string{to}, []byte(msg))
	if err != nil {
		return fmt.Errorf("send mail: %w", err)
	}
	return nil
}
