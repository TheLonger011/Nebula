import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';
import { mockMessages } from '../mocks/messages';

export const messagesApi = {
    async getMessages(channelId) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return mockMessages[channelId] || [];
        }
        return http(`/messages?channel=${channelId}`);
    },

    async sendMessage({ channelId, text, clientId }) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY);
            return {
                id: `srv-${Date.now()}`,
                clientId,
                channelId,
                text,
                createdAt: new Date().toISOString(),
                status: 'delivered',
            };
        }
        return http('/messages', {
            method: 'POST',
            body: JSON.stringify({ channelId, text, clientId }),
        });
    },
};