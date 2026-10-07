import { useApp } from '../../store/AppContext';
import IconStub from '../ui/IconStub';
import UserPanel from './UserPanel';
import styles from './ChannelList.module.css';

export default function ChannelList() {
    const { spaces, activeSpaceId, channels, activeChannelId, setActiveChannelId } = useApp();
    const space = spaces.find((s) => s.id === activeSpaceId);

    const textChannels = channels.filter((c) => c.type === 'text');
    const voiceChannels = channels.filter((c) => c.type === 'voice');

    return (
        <aside className={styles.sidebar}>
            <header className={styles.header}>
                <h2>{space?.name || 'Главная'}</h2>
                {space && <span className={styles.count}>{space.members}</span>}
            </header>

            <div className={styles.scroll}>
                {textChannels.length > 0 && (
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Текстовые</h3>
                        {textChannels.map((c) => (
                            <button
                                key={c.id}
                                className={[styles.item, activeChannelId === c.id ? styles.active : ''].join(' ')}
                                onClick={() => setActiveChannelId(c.id)}
                            >
                                <IconStub name="#" size={16} />
                                <span className={styles.name}>{c.name}</span>
                                {c.unread > 0 && <span className={styles.unread}>{c.unread}</span>}
                            </button>
                        ))}
                    </section>
                )}

                {voiceChannels.length > 0 && (
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Голосовые</h3>
                        {voiceChannels.map((c) => (
                            <button key={c.id} className={styles.item}>
                                <IconStub name="V" size={16} />
                                <span className={styles.name}>{c.name}</span>
                                {c.participants?.length > 0 && (
                                    <span className={styles.participants}>{c.participants.length}</span>
                                )}
                            </button>
                        ))}
                    </section>
                )}
            </div>

            <UserPanel />
        </aside>
    );
}