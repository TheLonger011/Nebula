import { useState } from 'react';
import { mockUsers } from '../mocks/users';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import styles from './FriendsPage.module.css';

const TABS = [
    { id: 'all', label: 'Все' },
    { id: 'online', label: 'Онлайн' },
    { id: 'requests', label: 'Запросы' },
];

export default function FriendsPage() {
    const [tab, setTab] = useState('all');

    const filtered = mockUsers.filter((u) => {
        if (tab === 'online') return u.status === 'online';
        if (tab === 'requests') return false;
        return true;
    });

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Друзья</h1>
                <div className={styles.tabs}>
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            className={[styles.tab, tab === t.id ? styles.active : ''].join(' ')}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </header>

            <ul className={styles.list}>
                {filtered.map((u) => (
                    <li key={u.id} className={styles.row}>
                        <Avatar name={u.displayName} size={40} status={u.status} />
                        <div className={styles.info}>
                            <span className={styles.name}>{u.displayName}</span>
                            <span className={styles.status}>
                {u.status === 'online' ? 'в сети' : 'не в сети'}
              </span>
                        </div>
                        <Button size="sm" variant="secondary">Написать</Button>
                    </li>
                ))}
                {filtered.length === 0 && <li className={styles.empty}>Ничего нет</li>}
            </ul>
        </div>
    );
}