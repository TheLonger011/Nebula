import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.page}>
            <div className={styles.bg} />
            <div className={styles.content}>{children}</div>
        </div>
    );
}