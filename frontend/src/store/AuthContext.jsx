import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/usersApi';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    token: null,
    loading: true,
    error: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
        case 'LOGOUT':
            return { ...initialState, loading: false };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // При загрузке — пробуем взять токен из localStorage
    useEffect(() => {
        const token = localStorage.getItem('nebula_token');
        if (!token) {
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        usersApi.getMe()
            .then((user) => {
                dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            })
            .catch(() => {
                localStorage.removeItem('nebula_token');
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { user, token } = await authApi.login(credentials);
            localStorage.setItem('nebula_token', token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            return user;
        } catch (e) {
            dispatch({ type: 'SET_ERROR', payload: e.message });
            throw e;
        }
    };

    const register = async (data) => authApi.register(data);
    const verify = async (data) => authApi.verifyEmail(data);
    const completeProfile = async (data) => {
        const { user, token } = await authApi.completeProfile(data);
        localStorage.setItem('nebula_token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return user;
    };

    const logout = () => {
        localStorage.removeItem('nebula_token');
        dispatch({ type: 'LOGOUT' });
    };

    const value = { ...state, login, register, verify, completeProfile, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}