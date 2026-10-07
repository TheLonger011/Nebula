import styles from './AppBackground.module.css';

export default function AppBackground({ children }) {
    return (
        <div className={styles.bg}>
            <div className={styles.grid} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </div>
    );
}