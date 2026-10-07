import { useEffect, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { mockUsers } from '../../mocks/users';
import { mockCurrentUser } from '../../mocks/currentUser';
import Message from './Message';
import Skeleton from '../ui/Skeleton';
import styles from './MessageList.module.css';

export default function MessageList() {
    const { messages, loading, retryMessage } = useApp();
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const resolveAuthor = (id) => {
        if (id === 'me') return mockCurrentUser;
        return mockUsers.find((u) => u.id === id) || { displayName: 'Неизвестный' };
    };

    if (loading) {
        return (
            <div className={styles.timeline}>
                <Skeleton height={60} />
                <Skeleton height={80} />
                <Skeleton height={60} />
            </div>
        );
    }

    if (!messages.length) {
        return (
            <div className={styles.empty}>
                <p>Сообщений пока нет.</p>
                <p className={styles.hint}>Напишите первым — Enter для отправки, Shift+Enter для переноса.</p>
            </div>
        );
    }

    return (
        <div className={styles.timeline}>
            {messages.map((m) => (
                <Message
                    key={m.id}
                    message={m}
                    author={resolveAuthor(m.authorId)}
                    isOwn={m.authorId === 'me'}
                    onRetry={retryMessage}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}