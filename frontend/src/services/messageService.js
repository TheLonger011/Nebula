import { messagesApi } from '../api/messagesApi';

export const messageService = {
    async load(channelId) {
        return messagesApi.getMessages(channelId);
    },

    async send({ channelId, text, onStatusChange }) {
        const clientId = `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        onStatusChange?.(clientId, 'sending');

        try {
            const saved = await messagesApi.sendMessage({ channelId, text, clientId });
            onStatusChange?.(clientId, 'delivered', saved);
            return saved;
        } catch (e) {
            onStatusChange?.(clientId, 'failed', { error: e.message });
            throw e;
        }
    },

    async retry({ channelId, text, clientId, onStatusChange }) {
        onStatusChange?.(clientId, 'sending');
        try {
            const saved = await messagesApi.sendMessage({ channelId, text, clientId });
            onStatusChange?.(clientId, 'delivered', saved);
            return saved;
        } catch (e) {
            onStatusChange?.(clientId, 'failed', { error: e.message });
            throw e;
        }
    },
};