import { mockApi } from '@/api/mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function getStoredToken() {
    return localStorage.getItem('nebula_token')
}

async function parseResponse(response) {
    if (response.status === 204) return null

    const text = await response.text()
    if (!text) return null

    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

async function request(path, options = {}) {
    const token = getStoredToken()

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...(options.body !== undefined
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            ...options.headers,
        },
    })

    const data = await parseResponse(response)

    if (!response.ok) {
        const message =
            typeof data === 'string'
                ? data
                : data?.error ||
                data?.message ||
                `HTTP ${response.status}`

        throw new Error(message)
    }

    return data
}

export const http = {
    get: (path) => request(path),

    post: (path, body) =>
        request(path, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    patch: (path, body) =>
        request(path, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: (path) =>
        request(path, {
            method: 'DELETE',
        }),
}

export const realApi = {
    login: (payload) =>
        http.post('/auth/login', payload),

    sendCode: ({ email, purpose = 'register' }) =>
        http.post(
            purpose === 'recover'
                ? '/auth/recover'
                : '/auth/register',
            { email }
        ),

    verifyCode: (payload) =>
        http.post('/auth/verify', payload),

    completeProfile: (payload) =>
        http.post('/auth/profile', payload),

    resetPassword: (payload) =>
        http.post('/auth/reset', payload),
}

export const api = USE_MOCK
    ? mockApi
    : realApi

export { USE_MOCK, API_URL }