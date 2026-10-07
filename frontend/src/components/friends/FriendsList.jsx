import { mockFriends } from '../../mocks/friends';
import FriendCard from './FriendCard';
import styles from './FriendsList.module.css';

export default function FriendsList({ onWrite }) {
    return (
        <ul className={styles.list}>
            {mockFriends.map((f) => (
                <li key={f.id}>
                    <FriendCard friend={f} onWrite={() => onWrite?.(f)} />
                </li>
            ))}
        </ul>
    );
}