import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import styles from './FriendCard.module.css';

export default function FriendCard({ friend, onWrite }) {
    return (
        <div className={styles.card}>
            <Avatar name={friend.displayName} size={40} status={friend.status} />
            <div className={styles.info}>
                <span className={styles.name}>{friend.displayName}</span>
                <span className={styles.status}>
          {friend.inVoice
              ? 'в голосе'
              : friend.status === 'online'
                  ? 'в сети'
                  : 'не в сети'}
        </span>
            </div>
            <Button size="sm" variant="secondary" onClick={onWrite}>
                Написать
            </Button>
        </div>
    );
}