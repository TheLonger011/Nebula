import { useAuth } from '../../store/AuthContext';
import Avatar from '../ui/Avatar';
import IconStub from '../ui/IconStub';
import styles from './UserPanel.module.css';

export default function UserPanel() {
    const { user } = useAuth();

    return (
        <div className={styles.wrapper}>
            <div className={styles.voiceBlock}>
                <div className={styles.voiceInfo}>
                    <span className={styles.voiceTitle}>Голос подключён</span>
                    <span className={styles.voiceSub}>Комната 1 · Go-практика</span>
                </div>
                <button className={styles.voiceExit} title="Выйти из комнаты">
                    <IconStub name="X" size={18} />
                </button>
            </div>

            <div className={styles.profile}>
                <Avatar name={user?.displayName || 'Гость'} size={36} status="online" />
                <div className={styles.info}>
                    <span className={styles.name}>{user?.displayName || 'Гость'}</span>
                    <span className={styles.status}>в сети</span>
                </div>
                <div className={styles.controls}>
                    <button title="Микрофон"><IconStub name="M" size={18} /></button>
                    <button title="Звук"><IconStub name="S" size={18} /></button>
                    <button title="Настройки"><IconStub name="⚙" size={18} /></button>
                </div>
            </div>
        </div>
    );
}