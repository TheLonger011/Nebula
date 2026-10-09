import { useState } from 'react'
import {
    Link,
    useNavigate,
} from 'react-router-dom'

import Logo from '@/components/Logo'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [identifier, setIdentifier] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [showPassword, setShowPassword] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const onSubmit = async event => {
        event.preventDefault()
        setError('')

        const value =
            identifier.trim()

        if (!value) {
            setError(
                'Введите почту или username'
            )
            return
        }

        if (password.length < 8) {
            setError(
                'Пароль должен содержать не менее 8 символов'
            )
            return
        }

        setLoading(true)

        try {
            await login({
                email: value,
                password,
            })

            navigate('/app', {
                replace: true,
            })
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Не удалось выполнить вход'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-window">
            <div className="auth-content">

                <h1 className="auth-title">
                    Авторизация
                </h1>

                <form
                    className="auth-form"
                    id="loginForm"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <div className="field">
                        <label
                            className="field-label"
                            htmlFor="username"
                        >
                            почта/username:
                        </label>

                        <input
                            className="input"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={identifier}
                            onChange={event =>
                                setIdentifier(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="field">
                        <label
                            className="field-label"
                            htmlFor="password"
                        >
                            пароль:
                        </label>

                        <div className="password-wrapper">
                            <input
                                className="input"
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="current-password"
                                value={password}
                                onChange={event =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                required
                            />

                            <span
                                className="password-divider"
                                aria-hidden="true"
                            />

                            <button
                                className="password-toggle"
                                type="button"
                                aria-label={
                                    showPassword
                                        ? 'Скрыть пароль'
                                        : 'Показать пароль'
                                }
                                aria-pressed={
                                    showPassword
                                }
                                onClick={() =>
                                    setShowPassword(
                                        value => !value
                                    )
                                }
                                disabled={loading}
                            >
                                <svg
                                    className="eye-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2.5 12C2.5 12 6 6.5 12 6.5C18 6.5 21.5 12 21.5 12C21.5 12 18 17.5 12 17.5C6 17.5 2.5 12 2.5 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.8"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                </svg>
                            </button>
                        </div>

                        <Link
                            to="/recover"
                            className="forgot-password"
                        >
                            Забыли пароль?
                        </Link>
                    </div>

                    {error && (
                        <p
                            className="auth-error auth-error--login"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </form>

                <div className="auth-bottom">
                    <button
                        type="submit"
                        form="loginForm"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? 'Вход…'
                            : 'Вход'}
                    </button>

                    <div className="register-text">
                        Нет учетной записи?{' '}

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Зарегистрируйся
                        </Link>
                    </div>
                </div>

                <Logo
                    variant="animation"
                    className="planet-logo"
                    alt=""
                />
            </div>
        </div>
    )
}