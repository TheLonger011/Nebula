import { useState } from 'react'
import {
    Link,
    useNavigate,
} from 'react-router-dom'

import { api } from '@/api/client'

const EMAIL_RE =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterEmail() {
    const navigate = useNavigate()

    const [email, setEmail] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const onSubmit = async event => {
        event.preventDefault()
        setError('')

        const value =
            email.trim().toLowerCase()

        if (!EMAIL_RE.test(value)) {
            setError(
                'Введите корректный адрес почты'
            )
            return
        }

        setLoading(true)

        try {
            await api.sendCode({
                email: value,
            })

            sessionStorage.setItem(
                'nebula_pending_email',
                value
            )

            navigate(
                '/register/verify'
            )
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Не удалось отправить код'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--narrow">
            <div
                className="progress"
                aria-label="Шаг 1 из 3"
            >
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg" />
                <span className="progress__seg" />
            </div>

            <h1 className="auth-card__title auth-card__title--narrow">
                Создайте аккаунт
            </h1>

            <p className="auth-card__lead">
                Укажите почту, мы отправим на неё код
                <br />
                подтверждения.
            </p>

            <form
                onSubmit={onSubmit}
                noValidate
            >
                <label
                    className="auth-label"
                    htmlFor="register-email"
                >
                    почта:
                </label>

                <input
                    className="auth-input"
                    id="register-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={event =>
                        setEmail(
                            event.target.value
                        )
                    }
                    disabled={loading}
                    required
                />

                <p className="auth-notice">
                    Сообщения в Nebula не имеют сквозного
                    <br />
                    шифрования.
                </p>

                {error && (
                    <p
                        className="auth-error auth-error--center"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <button
                    className="auth-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Отправка…'
                        : 'Получить код'}
                </button>
            </form>

            <div className="auth-bottom auth-bottom--right">
                Уже есть аккаунт?{' '}

                <Link
                    to="/login"
                    className="orange"
                >
                    Войти
                </Link>
            </div>
        </section>
    )
}