import { useState } from 'react';
import { mockUsers } from '../../mocks/users';
import Avatar from '../ui/Avatar';
import styles from './MembersPanel.module.css';

const TABS = [
    { id: 'members', label: 'Участники' },
    { id: 'threads', label: 'Ветки' },
    { id: 'files', label: 'Файлы' },
];

export default function MembersPanel() {
    const [tab, setTab] = useState('members');

    const inVoice = mockUsers.filter((u) => u.inVoice);
    const online = mockUsers.filter((u) => !u.inVoice && u.status === 'online');
    const offline = mockUsers.filter((u) => u.status === 'offline');

    return (
        <aside className={styles.panel}>
            <div className={styles.tabs}>
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        className={[styles.tab, tab === t.id ? styles.activeTab : ''].join(' ')}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className={styles.scroll}>
                {tab === 'members' && (
                    <>
                        <Section title="В голосе" count={inVoice.length} accent>
                            {inVoice.map((u) => <Member key={u.id} user={u} />)}
                        </Section>
                        <Section title="В сети" count={online.length}>
                            {online.map((u) => <Member key={u.id} user={u} />)}
                        </Section>
                        <Section title="Не в сети" count={offline.length}>
                            {offline.map((u) => <Member key={u.id} user={u} />)}
                        </Section>
                    </>
                )}

                {tab === 'threads' && <Empty text="Веток пока нет" />}
                {tab === 'files' && <Empty text="Файлов пока нет" />}
            </div>
        </aside>
    );
}

function Section({ title, count, accent, children }) {
    return (
        <section className={styles.section}>
            <h3 className={[styles.sectionTitle, accent ? styles.accentTitle : ''].join(' ')}>
                {title} <span className={styles.sectionCount}>— {count}</span>
            </h3>
            <div className={styles.list}>{children}</div>
        </section>
    );
}

function Member({ user }) {
    return (
        <div className={styles.member}>
            <Avatar
                name={user.displayName}
                size={32}
                speaking={user.speaking}
                muted={user.muted}
                status={user.status}
            />
            <div className={styles.memberInfo}>
                <span className={styles.memberName}>{user.displayName}</span>
                <span className={styles.memberStatus}>
          {user.inVoice ? (user.speaking ? 'говорит' : user.muted ? 'без звука' : 'в голосе') : user.status === 'online' ? 'в сети' : 'не в сети'}
        </span>
            </div>
        </div>
    );
}

function Empty({ text }) {
    return <div className={styles.empty}>{text}</div>;
}