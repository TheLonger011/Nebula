import { createContext, useContext, useState, useEffect } from 'react';
import { spacesApi } from '../api/spacesApi';
import { messagesApi } from '../api/messagesApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [spaces, setSpaces] = useState([]);
    const [activeSpaceId, setActiveSpaceId] = useState('s1');
    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState('c2');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        spacesApi.getSpaces().then((data) => {
            setSpaces(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!activeSpaceId) return;
        spacesApi.getChannels(activeSpaceId).then((data) => {
            setChannels(data);
            const firstText = data.find((c) => c.type === 'text');
            if (firstText) setActiveChannelId(firstText.id);
        });
    }, [activeSpaceId]);

    useEffect(() => {
        if (!activeChannelId) return;
        messagesApi.getMessages(activeChannelId).then(setMessages);
    }, [activeChannelId]);

    const sendMessage = async (text) => {
        const clientId = `c-${Date.now()}`;
        const optimistic = {
            id: clientId,
            clientId,
            channelId: activeChannelId,
            authorId: 'me',
            text,
            createdAt: new Date().toISOString(),
            status: 'sending',
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
            const saved = await messagesApi.sendMessage({ channelId: activeChannelId, text, clientId });
            setMessages((prev) =>
                prev.map((m) => (m.clientId === clientId ? { ...saved, authorId: 'me' } : m))
            );
        } catch {
            setMessages((prev) =>
                prev.map((m) => (m.clientId === clientId ? { ...m, status: 'failed' } : m))
            );
        }
    };

    const value = {
        spaces,
        activeSpaceId,
        setActiveSpaceId,
        channels,
        activeChannelId,
        setActiveChannelId,
        messages,
        setMessages,
        sendMessage,
        loading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
}