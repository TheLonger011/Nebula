import styles from './Input.module.css';

export default function Input({
                                  label,
                                  error,
                                  hint,
                                  id,
                                  type = 'text',
                                  ...rest
                              }) {
    const inputId = id || `input-${label?.replace(/\s/g, '-').toLowerCase()}`;

    return (
        <div className={styles.wrapper}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
            <input
                id={inputId}
                type={type}
                className={[styles.input, error ? styles.error : ''].join(' ')}
                {...rest}
            />
            {error && <span className={styles.errorText}>{error}</span>}
            {!error && hint && <span className={styles.hint}>{hint}</span>}
        </div>
    );
}