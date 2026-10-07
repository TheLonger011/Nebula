import { useApp } from '../store/AppContext';
import { mockUsers } from '../mocks/users';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import IconStub from '../components/ui/IconStub';
import styles from './SpacePage.module.css';

export default function SpacePage() {
    const { channels, activeChannelId } = useApp();
    const channel = channels.find((c) => c.id === activeChannelId);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.titleBlock}>
                    <IconStub name="#" size={18} />
                    <span className={styles.title}>{channel?.name || 'канал'}</span>
                    <span className={styles.subtitle}>Go-практика · разберём код на пятницу</span>
                </div>

                <div className={styles.search}>
                    <IconStub name="🔍" size={14} />
                    <input placeholder="Поиск по потоку" className={styles.searchInput} />
                </div>

                <button className={styles.invite}>Пригласить</button>
            </header>

            <MessageList />

            <MessageInput placeholder={`Написать в #${channel?.name || 'канал'}`} />
        </div>
    );
}