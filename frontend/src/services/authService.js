import { authApi } from '../api/authApi';

const TOKEN_KEY = 'nebula_token';

export const authService = {
    async login(credentials) {
        const { user, token } = await authApi.login(credentials);
        localStorage.setItem(TOKEN_KEY, token);
        return user;
    },

    async register(data) {
        return authApi.register(data);
    },

    async verify(data) {
        return authApi.verifyEmail(data);
    },

    async completeProfile(data) {
        const { user, token } = await authApi.completeProfile(data);
        localStorage.setItem(TOKEN_KEY, token);
        return user;
    },

    async logout() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated() {
        return Boolean(this.getToken());
    },
};