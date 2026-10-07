import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';
import { mockSpaces } from '../mocks/spaces';
import { mockChannels } from '../mocks/channels';

export const spacesApi = {
    async getSpaces() {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return mockSpaces;
        }
        return http('/spaces');
    },

    async getChannels(spaceId) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return mockChannels[spaceId] || [];
        }
        return http(`/spaces/${spaceId}/channels`);
    },
};