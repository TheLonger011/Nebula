import { useEffect, useState } from 'react';
import { messageService } from '../services/messageService';

export function useMessages(channelId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!channelId) return;
        setLoading(true);
        messageService
            .load(channelId)
            .then(setMessages)
            .finally(() => setLoading(false));
    }, [channelId]);

    const updateStatus = (clientId, status, data = {}) => {
        setMessages((prev) =>
            prev.map((m) => (m.clientId === clientId ? { ...m, status, ...data } : m))
        );
    };

    const send = async (text) => {
        const clientId = `c-${Date.now()}`;
        const optimistic = {
            id: clientId,
            clientId,
            channelId,
            authorId: 'me',
            text,
            createdAt: new Date().toISOString(),
            status: 'sending',
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
            await messageService.send({ channelId, text, onStatusChange: updateStatus });
        } catch {
            // status уже обновлён на failed
        }
    };

    return { messages, loading, send };
}