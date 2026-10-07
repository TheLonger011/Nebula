import { useState } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ children, text, position = 'top' }) {
    const [open, setOpen] = useState(false);

    return (
        <span
            className={styles.wrapper}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
      {children}
            {open && <span className={[styles.tip, styles[position]].join(' ')}>{text}</span>}
    </span>
    );
}