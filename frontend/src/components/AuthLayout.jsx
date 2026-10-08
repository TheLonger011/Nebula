import { Outlet } from 'react-router-dom'
import AuthBackground from './AuthBackground'

export default function AuthLayout() {
    return (
        <div className="auth-layout">
            <AuthBackground />
            <div className="auth-layout__content">
                <Outlet />
            </div>
        </div>
    )
}