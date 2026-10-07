import { passwordStrength, strengthLabel } from '../../utils/validators';
import styles from './PasswordMeter.module.css';

export default function PasswordMeter({ password }) {
    const score = passwordStrength(password);
    const label = strengthLabel(score);

    return (
        <div className={styles.wrapper}>
            <div className={styles.bars}>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={[styles.bar, i <= score ? styles[`level${score}`] : ''].join(' ')}
                    />
                ))}
            </div>
            <span className={styles.label}>Надёжность: {label}</span>
        </div>
    );
}