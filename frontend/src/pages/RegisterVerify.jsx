import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import { api } from '@/api/client'

function maskEmail(email) {
    if (
        !email ||
        !email.includes('@')
    ) {
        return 'вашу почту'
    }

    const [name, domain] =
        email.split('@')

    const visible =
        name.slice(
            0,
            Math.min(2, name.length)
        )

    return (
        `${visible}` +
        `${'*'.repeat(
            Math.max(
                1,
                name.length -
                visible.length
            )
        )}` +
        `@${domain}`
    )
}

export default function RegisterVerify() {
    const navigate = useNavigate()

    const inputRefs =
        useRef([])

    const [code, setCode] =
        useState(
            Array(6).fill('')
        )

    const [email] = useState(
        () =>
            sessionStorage.getItem(
                'nebula_pending_email'
            ) || ''
    )

    const [seconds, setSeconds] =
        useState(60)

    const [loading, setLoading] =
        useState(false)

    const [resending, setResending] =
        useState(false)

    const [error, setError] =
        useState('')

    useEffect(() => {
        if (seconds <= 0) {
            return undefined
        }

        const timer =
            window.setInterval(() => {
                setSeconds(value =>
                    Math.max(
                        0,
                        value - 1
                    )
                )
            }, 1000)

        return () =>
            window.clearInterval(timer)
    }, [seconds])

    useEffect(() => {
        if (!email) {
            navigate(
                '/register',
                { replace: true }
            )
        }
    }, [email, navigate])

    const updateCode = (
        index,
        value
    ) => {
        const digit =
            value
                .replace(/\D/g, '')
                .slice(-1)

        setCode(current => {
            const next = [
                ...current,
            ]

            next[index] = digit

            return next
        })

        if (
            digit &&
            index < 5
        ) {
            inputRefs.current[
            index + 1
                ]?.focus()
        }
    }

    const handleKeyDown = (
        index,
        event
    ) => {
        if (
            event.key ===
            'Backspace' &&
            !code[index] &&
            index > 0
        ) {
            inputRefs.current[
            index - 1
                ]?.focus()
        }
    }

    const handlePaste = event => {
        event.preventDefault()

        const pasted =
            event.clipboardData
                .getData('text')
                .replace(/\D/g, '')
                .slice(0, 6)

        const next =
            Array(6).fill('')

        pasted
            .split('')
            .forEach(
                (digit, index) => {
                    next[index] =
                        digit
                }
            )

        setCode(next)

        inputRefs.current[
            Math.min(
                pasted.length,
                5
            )
            ]?.focus()
    }

    const onSubmit = async event => {
        event.preventDefault()
        setError('')

        const value =
            code.join('')

        if (!/^\d{6}$/.test(value)) {
            setError(
                'Введите код из 6 цифр'
            )
            return
        }

        setLoading(true)

        try {
            await api.verifyCode({
                email,
                code: value,
            })

            sessionStorage.setItem(
                'nebula_verified_email',
                email
            )

            navigate(
                '/register/profile'
            )
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Не удалось подтвердить почту'
            )
        } finally {
            setLoading(false)
        }
    }

    const resend = async () => {
        if (
            seconds > 0 ||
            resending
        ) {
            return
        }

        setError('')
        setResending(true)

        try {
            await api.sendCode({
                email,
            })

            setSeconds(60)
            setCode(
                Array(6).fill('')
            )

            inputRefs.current[0]?.focus()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Не удалось отправить код повторно'
            )
        } finally {
            setResending(false)
        }
    }

    return (
        <section className="auth-card auth-card--otp">
            <div
                className="progress"
                aria-label="Шаг 2 из 3"
            >
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg progress__seg--active" />
                <span className="progress__seg" />
            </div>

            <h1 className="auth-card__title-otp">
                Подтвердите почту
            </h1>

            <p className="auth-card__lead auth-card__lead--otp">
                Код отправлен на {maskEmail(email)}.
                Он
                <br />
                действует 10 минут.
            </p>

            <form
                onSubmit={onSubmit}
                noValidate
            >
                <div
                    className="codes"
                    role="group"
                    aria-label="Код подтверждения"
                >
                    {code.map(
                        (
                            value,
                            index
                        ) => (
                            <input
                                key={index}
                                ref={element => {
                                    inputRefs.current[
                                        index
                                        ] = element
                                }}
                                value={value}
                                type="text"
                                inputMode="numeric"
                                autoComplete={
                                    index === 0
                                        ? 'one-time-code'
                                        : 'off'
                                }
                                maxLength={1}
                                aria-label={`Цифра ${
                                    index + 1
                                }`}
                                onChange={event =>
                                    updateCode(
                                        index,
                                        event.target
                                            .value
                                    )
                                }
                                onKeyDown={event =>
                                    handleKeyDown(
                                        index,
                                        event
                                    )
                                }
                                onPaste={
                                    handlePaste
                                }
                                disabled={
                                    loading
                                }
                            />
                        )
                    )}
                </div>

                <p className="attempts">
                    Осталось попыток: 5
                </p>

                <button
                    type="button"
                    className="resend-button"
                    onClick={resend}
                    disabled={
                        seconds > 0 ||
                        resending ||
                        loading
                    }
                >
                    Отправить снова через{' '}
                    <span className="orange">
                        0:
                        {String(
                            seconds
                        ).padStart(
                            2,
                            '0'
                        )}
                    </span>
                </button>

                {error && (
                    <p
                        className="auth-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <button
                    className="auth-btn auth-btn--lg"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Проверка…'
                        : 'Подтвердить'}
                </button>
            </form>

            <div className="change">
                <Link
                    to="/register"
                    className="orange"
                >
                    Изменить почту
                </Link>
            </div>
        </section>
    )
}