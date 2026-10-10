import { http } from './client'
import { mockApi } from './mock'

const PUBLIC = { skipAuth: true }

const authApi = {
    login: (p) => http.post('/auth/login', p, PUBLIC),
    sendCode: (p) => http.post('/auth/register', p, PUBLIC),
    verifyCode: (p) => http.post('/auth/verify', p, PUBLIC),
    completeProfile: (p) => http.post('/auth/profile', p, PUBLIC),
    recover: (p) => http.post('/auth/recover', p, PUBLIC),
    resetPassword: (p) => http.post('/auth/reset', p, PUBLIC),
}

export const api = {
    ...mockApi,
    ...authApi,
}
