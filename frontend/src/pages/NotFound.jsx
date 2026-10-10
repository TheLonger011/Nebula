import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function NotFound() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="auth-layout">
            <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                <h1 style={{ fontSize: 64, fontWeight: 700 }}>404</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Страница не найдена
                </p>
                <Link
                    to={isAuthenticated ? '/app' : '/login'}
                    className="auth-card__link"
                >
                    {isAuthenticated ? '← На главную' : '← Вернуться ко входу'}
                </Link>
            </div>
        </div>
    )
}
