import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PasswordInput from '@/components/PasswordInput'
import Progress from '@/components/Progress'
import { useAuth } from '@/context/AuthContext'
import { pendingRegistration } from '@/api/client'
import {
    PASSWORD_MIN,
    STRENGTH_STEPS,
    isUsername,
    maskEmail,
    parseBirthDate,
    strengthLabel,
} from '@/utils/auth'

const EMPTY_FORM = {
    username: '',
    displayName: '',
    password: '',
    confirm: '',
    day: '',
    month: '',
    year: '',
}

function ProfileForm({ email, ticket }) {
    const nav = useNavigate()
    const { register } = useAuth()

    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const updateField = (field) => (e) => {
        setForm((current) => ({ ...current, [field]: e.target.value }))
        setError('')
    }

    const passwordMismatch =
        form.confirm.length > 0 && form.password !== form.confirm

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const username = form.username.trim()
        const displayName = form.displayName.trim()

        if (!username || !form.password || !form.confirm) {
            setError('Заполните все обязательные поля')
            return
        }

        if (!isUsername(username)) {
            setError('Username: 3–16 символов, латиница, цифры и _')
            return
        }

        if (displayName.length > 64) {
            setError('Отображаемое имя: не более 64 символов')
            return
        }

        if (form.password.length < PASSWORD_MIN) {
            setError(`Пароль должен содержать минимум ${PASSWORD_MIN} символов`)
            return
        }

        if (passwordMismatch) {
            setError('Пароли не совпадают')
            return
        }

        const birth = parseBirthDate(form)
        if (birth.error) {
            setError(birth.error)
            return
        }

        setLoading(true)

        try {
            await register({
                email,
                ticket,
                username,
                // По ТЗ отображаемое имя необязательно и по умолчанию = username.
                displayName: displayName || username,
                password: form.password,
                ...(birth.value ? { birthDate: birth.value } : {}),
            })

            pendingRegistration.clear()
            nav('/app', { replace: true })
        } catch (err) {
            setError(err?.message || 'Не удалось создать аккаунт')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--profile">

            <Progress step={3} />

            <h1 className="profile-title">Расскажите о себе</h1>

            <p className="profile-sub">
                Почта{' '}
                <strong className="auth-email">{maskEmail(email)}</strong>{' '}
                подтверждена. Осталось заполнить профиль.
            </p>

            <form onSubmit={onSubmit} noValidate>

                <div className="profile-grid">

                    <div>
                        <label className="auth-label" htmlFor="username">
                            username:
                        </label>

                        <input
                            id="username"
                            className="auth-input"
                            type="text"
                            autoComplete="username"
                            value={form.username}
                            onChange={updateField('username')}
                            disabled={loading}
                        />

                        <small className="auth-hint">
                            3-16 символов: латиница, цифры, _
                        </small>
                    </div>

                    <div>
                        <label className="auth-label" htmlFor="display-name">
                            отображаемое имя:
                        </label>

                        <input
                            id="display-name"
                            className="auth-input"
                            type="text"
                            autoComplete="name"
                            maxLength={64}
                            value={form.displayName}
                            onChange={updateField('displayName')}
                            disabled={loading}
                        />

                        <small className="auth-hint">1-64 символа</small>
                    </div>

                    <div>
                        <label className="auth-label" htmlFor="profile-password">
                            пароль:
                        </label>

                        <PasswordInput
                            variant="profile"
                            id="profile-password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={updateField('password')}
                            disabled={loading}
                        />

                        <small className="auth-hint">
                            От {PASSWORD_MIN} символов. Надёжность:{' '}
                            {strengthLabel(form.password)}
                        </small>

                        <div className="strength">
                            {STRENGTH_STEPS.map((min) => (
                                <i
                                    key={min}
                                    className={`strength__seg ${
                                        form.password.length >= min
                                            ? 'strength__seg--active'
                                            : ''
                                    }`.trim()}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="auth-label" htmlFor="confirm-password">
                            подтвердите пароль:
                        </label>

                        <PasswordInput
                            variant="profile"
                            id="confirm-password"
                            invalid={passwordMismatch}
                            autoComplete="new-password"
                            value={form.confirm}
                            onChange={updateField('confirm')}
                            disabled={loading}
                        />

                        <small
                            className={
                                passwordMismatch
                                    ? 'auth-hint auth-hint--error'
                                    : 'auth-hint'
                            }
                        >
                            {passwordMismatch
                                ? 'Пароли не совпадают'
                                : 'Повторите пароль'}
                        </small>
                    </div>

                </div>

                <label
                    className="auth-label profile-birth-label"
                    htmlFor="birth-day"
                >
                    дата рождения:
                </label>

                <div className="profile-birth">

                    <input
                        id="birth-day"
                        className="auth-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="день"
                        value={form.day}
                        onChange={updateField('day')}
                        disabled={loading}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        aria-label="месяц рождения"
                        placeholder="месяц"
                        value={form.month}
                        onChange={updateField('month')}
                        disabled={loading}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        inputMode="numeric"
                        aria-label="год рождения"
                        maxLength={4}
                        placeholder="год"
                        value={form.year}
                        onChange={updateField('year')}
                        disabled={loading}
                    />

                </div>

                {error && (
                    <p
                        className="auth-inline-error auth-inline-error--profile"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <button
                    className="auth-btn auth-btn--lg"
                    type="submit"
                    disabled={loading || passwordMismatch}
                >
                    {loading ? 'Создание аккаунта…' : 'Зарегистрироваться'}
                </button>

                <div className="profile-foot">
                    <Progress step={3} style={{ margin: 0 }} />

                    <span className="muted">
                        После регистрации откроется главная
                    </span>
                </div>

            </form>

        </section>
    )
}

export default function RegisterProfile() {
    const pending = pendingRegistration.get()

    if (!pending?.email) return <Navigate to="/register" replace />
    if (!pending.ticket) return <Navigate to="/register/verify" replace />

    return <ProfileForm email={pending.email} ticket={pending.ticket} />
}
