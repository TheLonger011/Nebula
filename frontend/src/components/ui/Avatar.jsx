import styles from './Avatar.module.css';

export default function Avatar({ name = '?', src, size = 40, speaking = false, muted = false, status }) {
    const initials = name.trim().slice(0, 2).toUpperCase();

    return (
        <div
            className={[
                styles.wrapper,
                speaking ? styles.speaking : '',
                status ? styles[status] : '',
            ].join(' ')}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
            {muted && <span className={styles.mutedDot} />}
        </div>
    );
}