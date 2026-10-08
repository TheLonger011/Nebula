import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const maskEmail = (email) => {
    if (!email) {
        return 'почту, указанную при регистрации'
    }

    const atIndex = email.indexOf('@')

    if (atIndex <= 0) {
        return email
    }

    const local = email.slice(0, atIndex)
    const domain = email.slice(atIndex + 1)

    if (!domain) {
        return email
    }

    return `${local.slice(0, 1)}***@${domain}`
}

export default function RegisterProfile() {
    const nav = useNavigate()
    const { register } = useAuth()

    const email =
        sessionStorage.getItem('nebula_verified_email') ||
        sessionStorage.getItem('nebula_pending_email') || ''

    const [form, setForm] = useState({
        username: '',
        displayName: '',
        password: '',
        confirm: '',
        day: '',
        month: '',
        year: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const updateField = (field) => (e) => {
        setForm((current) => ({
            ...current,
            [field]: e.target.value,
        }))

        setError('')
    }

    const passwordMismatch =
        form.confirm.length > 0 &&
        form.password !== form.confirm

    const onSubmit = async (e) => {
        e.preventDefault()

        setError('')

        const username = form.username.trim()
        const displayName = form.displayName.trim() || username

        if (!username || !form.password || !form.confirm) {
            setError('Заполните обязательные поля')
            return
        }

        if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
            setError('Username: 3-16 символов, только латиница, цифры и _')
            return
        }

        if (displayName.length > 64) {
            setError('Отображаемое имя должно содержать не более 64 символов')
            return
        }

        if (form.password.length < 8) {
            setError(
                'Пароль должен содержать минимум 8 символов'
            )
            return
        }

        if (passwordMismatch) {
            setError('Пароли не совпадают')
            return
        }

        setLoading(true)

        try {
            await register({
                ...form,
                username,
                displayName,
                email,
            })

            sessionStorage.removeItem(
                'nebula_pending_email'
            )
            sessionStorage.removeItem(
                'nebula_verified_email'
            )

            nav('/app')
        } catch (err) {
            setError(
                err?.message ||
                'Не удалось создать аккаунт'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-card auth-card--profile">

            <div className="progress">
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg progress__seg--active" />
            </div>

            <h1 className="profile-title">
                Расскажите о себе
            </h1>

            <p className="profile-sub">
                Почта{' '}
                <strong className="auth-email">
                    {maskEmail(email)}
                </strong>{' '}
                подтверждена. Осталось заполнить профиль.
            </p>

            <form onSubmit={onSubmit}>

                <div className="profile-grid">

                    <div>
                        <label
                            className="auth-label"
                            htmlFor="username"
                        >
                            username:
                        </label>

                        <input
                            id="username"
                            className="auth-input"
                            type="text"
                            autoComplete="username"
                            value={form.username}
                            onChange={updateField('username')}
                        />

                        <small className="auth-hint">
                            3-16 символов: латиница, цифры, _
                        </small>
                    </div>

                    <div>
                        <label
                            className="auth-label"
                            htmlFor="display-name"
                        >
                            отображаемое имя:
                        </label>

                        <input
                            id="display-name"
                            className="auth-input"
                            type="text"
                            autoComplete="name"
                            value={form.displayName}
                            onChange={updateField('displayName')}
                        />

                        <small className="auth-hint">
                            1-64 символа
                        </small>
                    </div>

                    <div>
                        <label
                            className="auth-label"
                            htmlFor="profile-password"
                        >
                            пароль:
                        </label>

                        <div className="pass-wrap">

                            <input
                                id="profile-password"
                                className="auth-input"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="new-password"
                                value={form.password}
                                onChange={updateField('password')}
                            />

                            <button
                                type="button"
                                className="pass-eye"
                                aria-label={
                                    showPassword
                                        ? 'Скрыть пароль'
                                        : 'Показать пароль'
                                }
                                onClick={() =>
                                    setShowPassword(
                                        (value) => !value
                                    )
                                }
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2.5 12C2.5 12 6 6.5 12 6.5C18 6.5 21.5 12 21.5 12C21.5 12 18 17.5 12 17.5C6 17.5 2.5 12 2.5 12Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                </svg>
                            </button>

                        </div>

                        <small className="auth-hint">
                            От 8 символов.
                            Надёжность:{' '}
                            {form.password.length >= 8
                                ? 'хорошая'
                                : 'не указана'}
                        </small>

                        <div className="strength">
                            <i
                                className={`strength__seg ${
                                    form.password.length >= 1
                                        ? 'strength__seg--active'
                                        : ''
                                }`}
                            />

                            <i
                                className={`strength__seg ${
                                    form.password.length >= 4
                                        ? 'strength__seg--active'
                                        : ''
                                }`}
                            />

                            <i
                                className={`strength__seg ${
                                    form.password.length >= 8
                                        ? 'strength__seg--active'
                                        : ''
                                }`}
                            />

                            <i
                                className={`strength__seg ${
                                    form.password.length >= 12
                                        ? 'strength__seg--active'
                                        : ''
                                }`}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            className="auth-label"
                            htmlFor="confirm-password"
                        >
                            подтвердите пароль:
                        </label>

                        <div
                            className={`pass-wrap ${
                                passwordMismatch
                                    ? 'pass-wrap--error'
                                    : ''
                            }`}
                        >
                            <input
                                id="confirm-password"
                                className="auth-input"
                                type={
                                    showConfirm
                                        ? 'text'
                                        : 'password'
                                }
                                autoComplete="new-password"
                                value={form.confirm}
                                onChange={updateField('confirm')}
                            />

                            <button
                                type="button"
                                className="pass-eye"
                                aria-label={
                                    showConfirm
                                        ? 'Скрыть пароль'
                                        : 'Показать пароль'
                                }
                                onClick={() =>
                                    setShowConfirm(
                                        (value) => !value
                                    )
                                }
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2.5 12C2.5 12 6 6.5 12 6.5C18 6.5 21.5 12 21.5 12C21.5 12 18 17.5 12 17.5C6 17.5 2.5 12 2.5 12Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                </svg>
                            </button>
                        </div>

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
                        placeholder="день"
                        value={form.day}
                        onChange={updateField('day')}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        placeholder="месяц"
                        value={form.month}
                        onChange={updateField('month')}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="год"
                        value={form.year}
                        onChange={updateField('year')}
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
                    disabled={
                        loading ||
                        passwordMismatch
                    }
                >
                    {loading
                        ? 'Создание аккаунта…'
                        : 'Зарегистрироваться'}
                </button>

                <div className="profile-foot">

                    <div
                        className="progress"
                        style={{ margin: 0 }}
                    >
                        <span className="progress__seg progress__seg--active" />
                        <span className="progress__seg progress__seg--active" />
                        <span className="progress__seg progress__seg--active" />
                    </div>

                    <span className="muted">
                        После регистрации откроется главная
                    </span>

                </div>

            </form>

        </section>
    )
}