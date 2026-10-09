import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { api } from '@/api/client'

const AuthCtx = createContext(null)

function readStoredUser() {
    const token =
        localStorage.getItem('nebula_token')

    const rawUser =
        localStorage.getItem('nebula_user')

    if (!token || !rawUser) {
        return null
    }

    try {
        return JSON.parse(rawUser)
    } catch {
        localStorage.removeItem('nebula_token')
        localStorage.removeItem('nebula_user')

        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setUser(readStoredUser())
        setReady(true)
    }, [])

    const login = async credentials => {
        const response =
            await api.login(credentials)

        const {
            user: nextUser,
            token,
        } = response || {}

        if (!token || !nextUser) {
            throw new Error(
                'Сервер вернул некорректный ответ авторизации'
            )
        }

        localStorage.setItem(
            'nebula_token',
            token
        )

        localStorage.setItem(
            'nebula_user',
            JSON.stringify(nextUser)
        )

        setUser(nextUser)

        return nextUser
    }

    const register = async payload => {
        const response =
            await api.completeProfile(payload)

        const {
            user: nextUser,
            token,
        } = response || {}

        if (!token || !nextUser) {
            throw new Error(
                'Сервер вернул некорректный ответ регистрации'
            )
        }

        localStorage.setItem(
            'nebula_token',
            token
        )

        localStorage.setItem(
            'nebula_user',
            JSON.stringify(nextUser)
        )

        setUser(nextUser)

        return nextUser
    }

    const logout = () => {
        localStorage.removeItem(
            'nebula_token'
        )

        localStorage.removeItem(
            'nebula_user'
        )

        setUser(null)
    }

    const value = useMemo(
        () => ({
            user,
            ready,

            isAuthenticated:
                Boolean(
                    user &&
                    localStorage.getItem(
                        'nebula_token'
                    )
                ),

            login,
            register,
            logout,
        }),
        [user, ready]
    )

    return (
        <AuthCtx.Provider value={value}>
            {children}
        </AuthCtx.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthCtx)

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        )
    }

    return context
}