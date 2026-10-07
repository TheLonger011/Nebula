import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';
import { mockCurrentUser } from '../mocks/currentUser';

export const authApi = {
    async login({ email, password }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            if (!email || !password) throw new Error('Заполните все поля');
            return { user: mockCurrentUser, token: 'mock-token' };
        }
        return http('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    async register({ email }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return { email, attemptsLeft: 5, ttl: 600 };
        }
        return http('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async verifyEmail({ email, code }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            if (code !== '123456') throw new Error('Неверный код');
            return { verified: true, token: 'mock-token' };
        }
        return http('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
    },

    async completeProfile({ username, displayName, password, birthDate }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return { user: { ...mockCurrentUser, username, displayName }, token: 'mock-token' };
        }
        return http('/auth/profile', {
            method: 'POST',
            body: JSON.stringify({ username, displayName, password, birthDate }),
        });
    },

    async forgotPassword({ email }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return { email };
        }
        return http('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword({ email, code, password }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return { success: true };
        }
        return http('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, code, password }),
        });
    },
};