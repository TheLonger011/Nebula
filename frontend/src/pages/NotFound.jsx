import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="auth-layout">
            <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                <h1 style={{ fontSize: 64, fontWeight: 700 }}>404</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Страница не найдена
                </p>
                <Link to="/login" className="auth-card__link">← Вернуться ко входу</Link>
            </div>
        </div>
    )
}