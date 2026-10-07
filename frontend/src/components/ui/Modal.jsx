import { useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (!open) return;
        const onEsc = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {title && <h3 className={styles.title}>{title}</h3>}
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
}