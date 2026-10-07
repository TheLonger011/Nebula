import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';
import { mockCurrentUser } from '../mocks/currentUser';

export const usersApi = {
    async getMe() {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return mockCurrentUser;
        }
        return http('/users/me');
    },

    async updateProfile(patch) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return { ...mockCurrentUser, ...patch };
        }
        return http('/users/me', { method: 'PATCH', body: JSON.stringify(patch) });
    },
};