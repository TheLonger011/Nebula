import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Progress from '@/components/Progress'
import { api } from '@/api'
import { pendingRegistration } from '@/api/client'
import { isEmail } from '@/utils/auth'

export default function RegisterEmail() {
    const nav = useNavigate()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const normalized = email.trim().toLowerCase()

        if (!normalized) {
            setError('Введите почту')
            return
        }

        if (!isEmail(normalized)) {
            setError('Введите корректный адрес почты')
            return
        }

        setLoading(true)

        try {
            await api.sendCode({ email: normalized })

            // Сохраняем только после успешной отправки кода.
            pendingRegistration.set({ email: normalized })
            nav('/register/verify')
        } catch (err) {
            setError(err?.message || 'Не удалось отправить код')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--narrow">

            <Progress step={1} />

            <h1 className="auth-card__title auth-card__title--narrow">
                Создайте аккаунт
            </h1>

            <p className="auth-card__lead">
                Укажите почту, мы отправим на неё код
                <br />
                подтверждения.
            </p>

            <form onSubmit={onSubmit} noValidate>

                <label className="auth-label" htmlFor="register-email">
                    почта:
                </label>

                <input
                    id="register-email"
                    className="auth-input"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

                {error && (
                    <p className="auth-inline-error" role="alert">
                        {error}
                    </p>
                )}

                <p className="auth-notice">
                    Сообщения в Nebula не имеют сквозного
                    <br />
                    шифрования.
                </p>

                <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? 'Отправка…' : 'Получить код'}
                </button>

            </form>

            <div className="auth-bottom auth-bottom--right">
                <span>Уже есть аккаунт? </span>

                <Link to="/login" className="orange">
                    Войти
                </Link>
            </div>

        </section>
    )
}
