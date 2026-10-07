import styles from './Button.module.css';

export default function Button({
                                   children,
                                   variant = 'primary',
                                   size = 'md',
                                   fullWidth = false,
                                   loading = false,
                                   disabled = false,
                                   type = 'button',
                                   ...rest
                               }) {
    return (
        <button
            type={type}
            className={[
                styles.button,
                styles[variant],
                styles[size],
                fullWidth ? styles.fullWidth : '',
            ].join(' ')}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? <span className={styles.spinner} /> : children}
        </button>
    );
}