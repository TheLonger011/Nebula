import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import PasswordInput from '@/components/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/api'
import { pendingRegistration } from '@/api/client'

export default function Login() {
    const nav = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const [loginValue, setLoginValue] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const notice = location.state?.notice || ''
    const from = location.state?.from?.pathname
    const target = from && from.startsWith('/app') ? from : '/app'

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const normalized = loginValue.trim().toLowerCase()

        if (!normalized || !password) {
            setError('Заполните все поля')
            return
        }

        setLoading(true)

        try {
            await login({ login: normalized, password })
            nav(target, { replace: true })
        } catch (err) {
            if (err?.code === 'EMAIL_NOT_VERIFIED' && err.data?.email) {
                // Почта не подтверждена — отправляем код и ведём на ввод кода.
                try {
                    await api.sendCode({ email: err.data.email })
                    pendingRegistration.set({ email: err.data.email })
                    nav('/register/verify')
                    return
                } catch (sendErr) {
                    setError(sendErr?.message || 'Не удалось отправить код')
                    return
                }
            }

            setError(err?.message || 'Не удалось выполнить вход')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-window">
            <div className="auth-content">

                <h1 className="auth-title">Авторизация</h1>

                <form className="auth-form" id="loginForm" onSubmit={onSubmit}>
                    <div className="field">
                        <label className="field-label" htmlFor="login-email">
                            почта/username:
                        </label>

                        <input
                            className="input"
                            id="login-email"
                            name="login"
                            type="text"
                            autoComplete="username"
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="login-password">
                            пароль:
                        </label>

                        <PasswordInput
                            id="login-password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />

                        <Link to="/recover" className="forgot-password">
                            Забыли пароль?
                        </Link>
                    </div>
                </form>

                {(error || notice) && (
                    <p
                        className={`auth-form-error ${error ? '' : 'auth-form-notice'}`.trim()}
                        role={error ? 'alert' : 'status'}
                    >
                        {error || notice}
                    </p>
                )}

                <div className="auth-bottom">
                    <button
                        type="submit"
                        form="loginForm"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Вход…' : 'Вход'}
                    </button>

                    <div className="register-text">
                        <span>Нет учетной записи? </span>

                        <Link to="/register" className="register-link">
                            Зарегистрируйся
                        </Link>
                    </div>
                </div>

                <Logo variant="animation" className="planet-logo" alt="" />

            </div>
        </div>
    )
}
