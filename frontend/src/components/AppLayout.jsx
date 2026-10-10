import { Outlet } from 'react-router-dom'
import RequireAuth from './RequireAuth'

// Приватная зона /app/*: без токена — редирект на /login.
export default function AppLayout() {
    return (
        <RequireAuth>
            <Outlet />
        </RequireAuth>
    )
}
