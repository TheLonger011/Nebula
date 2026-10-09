import {
    Navigate,
    Outlet,
    createBrowserRouter,
} from 'react-router-dom'

import AuthLayout from '@/components/AuthLayout'
import AppLayout from '@/components/AppLayout'
import { useAuth } from '@/context/AuthContext'

import Login from '@/pages/Login'
import RegisterEmail from '@/pages/RegisterEmail'
import RegisterVerify from '@/pages/RegisterVerify'
import RegisterProfile from '@/pages/RegisterProfile'
import RecoverPassword from '@/pages/RecoverPassword'

import Home from '@/pages/Home'
import Chat from '@/pages/Chat'
import NotFound from '@/pages/NotFound'

function RequireAuth() {
    const {
        ready,
        isAuthenticated,
    } = useAuth()

    if (!ready) {
        return null
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    return <Outlet />
}

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,

        children: [
            {
                path: '/',
                element: (
                    <Navigate
                        to="/login"
                        replace
                    />
                ),
            },

            {
                path: '/login',
                element: <Login />,
            },

            {
                path: '/register',
                element: <RegisterEmail />,
            },

            {
                path: '/register/verify',
                element: <RegisterVerify />,
            },

            {
                path: '/register/profile',
                element: <RegisterProfile />,
            },

            {
                path: '/recover',
                element: <RecoverPassword />,
            },
        ],
    },

    {
        path: '/app',
        element: <AppLayout />,

        children: [
            {
                element: <RequireAuth />,

                children: [
                    {
                        index: true,
                        element: <Home />,
                    },

                    {
                        path: 'home',
                        element: <Home />,
                    },

                    {
                        path: 'channels/:channelId',
                        element: <Chat />,
                    },
                ],
            },
        ],
    },

    {
        path: '*',
        element: <NotFound />,
    },
])