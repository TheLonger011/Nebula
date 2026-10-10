import { Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AppLayout() {
    const { ready } = useAuth()

    if (!ready) {
        return null
    }

    return <Outlet />
}