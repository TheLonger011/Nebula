import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';
import { mockSpaces } from '../mocks/spaces';

export const searchApi = {
    async search(query) {
        if (!query || query.length < 2) return { spaces: [], users: [], messages: [] };
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            const q = query.toLowerCase();
            return {
                spaces: mockSpaces.filter((s) => s.name.toLowerCase().includes(q)),
                users: [],
                messages: [],
            };
        }
        return http(`/search?q=${encodeURIComponent(query)}`);
    },
};