import { useAuth } from '../store/AuthContext';
import { useApp } from '../store/AppContext';
import IconStub from '../components/ui/IconStub';
import Avatar from '../components/ui/Avatar';
import { mockUsers } from '../mocks/users';
import styles from './HomePage.module.css';

export default function HomePage() {
    const { user } = useAuth();
    const { spaces, setActiveSpaceId } = useApp();

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.search}>
                    <IconStub name="🔍" size={16} />
                    <input placeholder="Поиск..." className={styles.searchInput} />
                </div>
                <nav className={styles.nav}>
                    <button className={styles.navActive}>Главная</button>
                    <button className={styles.navItem}>Потоки</button>
                    <button className={styles.navItem}>Люди</button>
                </nav>
                <button className={styles.invite}>Пригласить</button>
            </header>

            <div className={styles.content}>
                <h2 className={styles.greeting}>Добрый вечер, {user?.displayName || 'гость'}</h2>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Потоки</h3>
                    <div className={styles.grid}>
                        <QuickCard icon="код-ревью" sub="Go-практика" />
                        <QuickCard icon="общий" sub="Go-практика" />
                        <QuickCard icon="вопросы-по-go" sub="3 новых" />
                        <QuickCard icon="обсуждение" sub="Курс" />
                        <QuickCard icon="вакансии" sub="Курс" />
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Пространства для вас</h3>
                    <div className={styles.spacesGrid}>
                        {spaces.map((s) => (
                            <button key={s.id} className={styles.spaceCard} onClick={() => setActiveSpaceId(s.id)}>
                                <div className={styles.spaceCover} style={{ background: s.color }} />
                                <span className={styles.spaceName}>{s.name}</span>
                                <span className={styles.spaceMembers}>{s.members} человек</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Друзья</h3>
                    <div className={styles.friendsRow}>
                        {mockUsers.map((u) => (
                            <div key={u.id} className={styles.friend}>
                                <Avatar name={u.displayName} size={56} status={u.status} />
                                <span className={styles.friendName}>{u.displayName}</span>
                                <span className={styles.friendStatus}>{u.status === 'online' ? 'в сети' : 'не в сети'}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function QuickCard({ icon, sub }) {
    return (
        <button className={styles.quickCard}>
            <span className={styles.quickIcon}>{icon}</span>
            <span className={styles.quickSub}>{sub}</span>
        </button>
    );
}