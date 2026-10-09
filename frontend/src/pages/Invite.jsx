import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthBackground from '@/components/AuthBackground'
import Logo from '@/components/Logo'
import { api } from '@/api'
import { useAuth } from '@/context/AuthContext'

export default function Invite() {
    const { code } = useParams()
    const nav = useNavigate()
    const { isAuthenticated } = useAuth()
    const [state, setState] = useState({ loading: true, error: '', space: null })

    useEffect(() => {
        if (!isAuthenticated) return
        api.acceptInvite({ code })
            .then(({ space }) => setState({ loading: false, error: '', space }))
            .catch((e) => setState({ loading: false, error: e?.message || 'Не удалось принять приглашение', space: null }))
    }, [code, isAuthenticated])

    return (
        <div className="auth-layout">
            <AuthBackground />
            <div className="auth-layout__content">
                <section className="auth-card auth-card--narrow" style={{ textAlign: 'center' }}>
                    <Logo size={120} />

                    {!isAuthenticated && (
                        <>
                            <h1 className="auth-card__title auth-card__title--narrow">
                                Приглашение
                            </h1>
                            <p className="auth-card__lead">
                                Войдите или зарегистрируйтесь, чтобы принять приглашение.
                            </p>
                            <Link to="/login" className="btn btn--primary" style={{ display: 'inline-flex', marginTop: 12 }}>
                                Войти
                            </Link>
                        </>
                    )}

                    {isAuthenticated && state.loading && (
                        <p className="muted" style={{ marginTop: 16 }}>Проверяем приглашение…</p>
                    )}

                    {isAuthenticated && state.error && (
                        <p className="auth-inline-error" style={{ marginTop: 16 }}>{state.error}</p>
                    )}

                    {isAuthenticated && state.space && (
                        <>
                            <h1 className="auth-card__title auth-card__title--narrow" style={{ marginTop: 16 }}>
                                Вы в «{state.space.name}»
                            </h1>
                            <button
                                className="btn btn--primary"
                                style={{ marginTop: 12 }}
                                onClick={() => nav(`/app/spaces/${state.space.id}`)}
                            >
                                Перейти в пространство
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}