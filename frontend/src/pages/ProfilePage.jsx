import { useAuth } from '../store/AuthContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Профиль</h1>

            <div className={styles.card}>
                <Avatar name={user?.displayName || 'Гость'} size={80} status="online" />
                <div className={styles.info}>
                    <h2>{user?.displayName || 'Гость'}</h2>
                    <span className={styles.username}>@{user?.username || 'guest'}</span>
                    <span className={styles.status}>в сети</span>
                </div>
            </div>

            <div className={styles.section}>
                <h3>О себе</h3>
                <p>{user?.bio || 'Пока ничего не рассказал.'}</p>
            </div>

            <div className={styles.section}>
                <h3>Дата рождения</h3>
                <p>{user?.birthDate || '—'}</p>
            </div>

            <Button>Изменить профиль</Button>
        </div>
    );
}