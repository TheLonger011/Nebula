import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OtpInput from '@/components/OtpInput'
import PasswordInput from '@/components/PasswordInput'
import Progress from '@/components/Progress'
import { api } from '@/api'
import { CODE_LENGTH, PASSWORD_MIN, isEmail, maskEmail } from '@/utils/auth'

// Шаги: 1 — почта, 2 — код из письма, 3 — новый пароль.
const CODE_ERRORS = ['INVALID_CODE', 'CODE_EXPIRED', 'CODE_ATTEMPTS_EXCEEDED']

export default function RecoverPassword() {
    const nav = useNavigate()

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const passwordMismatch = confirm.length > 0 && password !== confirm

    const sendCode = async (e) => {
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
            await api.recover({ email: normalized })
            setEmail(normalized)
            setStep(2)
        } catch (err) {
            setError(err?.message || 'Не удалось отправить код')
        } finally {
            setLoading(false)
        }
    }

    const confirmCode = (e) => {
        e.preventDefault()
        setError('')

        if (code.length !== CODE_LENGTH) {
            setError(`Введите ${CODE_LENGTH}-значный код`)
            return
        }

        setStep(3)
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < PASSWORD_MIN) {
            setError(`Пароль должен содержать минимум ${PASSWORD_MIN} символов`)
            return
        }

        if (password !== confirm) {
            setError('Пароли не совпадают')
            return
        }

        setLoading(true)

        try {
            await api.resetPassword({ email, code, password })
            nav('/login', {
                replace: true,
                state: { notice: 'Пароль изменён. Войдите с новым паролем' },
            })
        } catch (err) {
            setError(err?.message || 'Не удалось изменить пароль')

            if (CODE_ERRORS.includes(err?.code)) {
                setCode('')
                setStep(2)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--narrow">

            <Progress step={step} />

            <h1 className="auth-card__title auth-card__title--narrow">
                Восстановление пароля
            </h1>

            {step === 1 && (
                <>
                    <p className="auth-card__lead">
                        Введите почту аккаунта. Пришлем код, затем
                        <br />
                        вы зададите новый пароль.
                    </p>

                    <form onSubmit={sendCode} noValidate>
                        <label className="auth-label" htmlFor="recovery-email">
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
                            disabled={loading}
                        />

                        {error && (
                            <p className="auth-inline-error" role="alert">
                                {error}
                            </p>
                        )}

                        <p className="auth-notice">
                            Если вы не запрашивали код,
                            проигнорируйте письмо.
                        </p>

                        <button className="auth-btn" type="submit" disabled={loading}>
                            {loading ? 'Отправка…' : 'Получить код'}
                        </button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <p className="auth-card__lead">
                        Код отправлен на {maskEmail(email)}.
                        <br />
                        Он действует 10 минут.
                    </p>

                    <form onSubmit={confirmCode}>
                        <OtpInput
                            length={CODE_LENGTH}
                            value={code}
                            onChange={setCode}
                        />

                        {error && (
                            <p className="auth-inline-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            className="auth-btn"
                            type="submit"
                            disabled={code.length !== CODE_LENGTH}
                        >
                            Продолжить
                        </button>
                    </form>

                    <div className="auth-bottom auth-bottom--center">
                        <button
                            type="button"
                            className="auth-link-btn"
                            onClick={() => {
                                setError('')
                                setCode('')
                                setStep(1)
                            }}
                        >
                            Изменить почту
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <p className="auth-card__lead">Задайте новый пароль.</p>

                    <form onSubmit={resetPassword} noValidate>
                        <label className="auth-label" htmlFor="new-password">
                            новый пароль:
                        </label>

                        <PasswordInput
                            variant="profile"
                            id="new-password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />

                        <small className="auth-hint">От {PASSWORD_MIN} символов</small>

                        <label
                            className="auth-label profile-birth-label"
                            htmlFor="new-password-confirm"
                        >
                            подтвердите пароль:
                        </label>

                        <PasswordInput
                            variant="profile"
                            id="new-password-confirm"
                            invalid={passwordMismatch}
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            disabled={loading}
                        />

                        {passwordMismatch && (
                            <small className="auth-hint auth-hint--error">
                                Пароли не совпадают
                            </small>
                        )}

                        {error && (
                            <p className="auth-inline-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            className="auth-btn"
                            type="submit"
                            style={{ marginTop: 18 }}
                            disabled={loading || passwordMismatch}
                        >
                            {loading ? 'Сохранение…' : 'Сменить пароль'}
                        </button>
                    </form>
                </>
            )}

            {step !== 2 && (
                <div className="auth-bottom auth-bottom--center">
                    <Link to="/login" className="orange">
                        Вернуться ко входу
                    </Link>
                </div>
            )}

        </section>
    )
}
