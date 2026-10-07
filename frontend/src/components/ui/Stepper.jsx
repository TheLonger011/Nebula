import styles from './Stepper.module.css';

export default function Stepper({ steps = 3, current = 1 }) {
    return (
        <div className={styles.stepper} aria-label={`Шаг ${current} из ${steps}`}>
            {Array.from({ length: steps }).map((_, i) => (
                <div
                    key={i}
                    className={[styles.segment, i < current ? styles.active : ''].join(' ')}
                />
            ))}
        </div>
    );
}