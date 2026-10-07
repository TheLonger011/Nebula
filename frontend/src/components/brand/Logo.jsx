import styles from './Logo.module.css';

export default function Logo({ size = 32, withText = false }) {
    return (
        <div className={styles.wrapper} style={{ gap: 10 }}>
            <img src="/logo.svg" alt="Nebula" className={styles.img} style={{ width: size, height: size }} />
            {withText && <span className={styles.text}>Nebula</span>}
        </div>
    );
}