import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'

export default function RecoverPassword() {
    const nav = useNavigate()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()

        setError('')

        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedEmail) {
            setError('Введите почту')
            return
        }

        setLoading(true)

        try {
            sessionStorage.setItem(
                'nebula_recovery_email',
                normalizedEmail
            )

            await api.sendCode({
                email: normalizedEmail,
                purpose: 'recover',
            })

            nav('/login')
        } catch (err) {
            setError(
                err?.message ||
                'Не удалось отправить код'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--narrow">

            <div className="progress">
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg" />
                <span className="progress__seg" />
            </div>

            <h1 className="auth-card__title auth-card__title--narrow">
                Восстановление пароля
            </h1>

            <p className="auth-card__lead">
                Введите почту аккаунта. Пришлем код, затем
                <br />
                вы зададите новый пароль.
            </p>

            <form onSubmit={onSubmit}>

                <label
                    className="auth-label"
                    htmlFor="recovery-email"
                >
                    почта:
                </label>

                <input
                    id="recovery-email"
                    className="auth-input"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && (
                    <p
                        className="auth-inline-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <p className="auth-notice">
                    Если вы не запрашивали код,
                    проигнорируйте письмо.
                </p>

                <button
                    className="auth-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Отправка…'
                        : 'Отправить код'}
                </button>

            </form>

            <div className="auth-bottom auth-bottom--center">
                <Link
                    to="/login"
                    className="orange"
                >
                    Вернуться ко входу
                </Link>
            </div>

        </section>
    )
}