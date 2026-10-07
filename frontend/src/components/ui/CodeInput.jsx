import { useRef } from 'react';
import styles from './CodeInput.module.css';

export default function CodeInput({ length = 6, value = '', onChange }) {
    const inputsRef = useRef([]);
    const digits = value.padEnd(length, ' ').split('').slice(0, length);

    const setDigit = (i, d) => {
        const next = digits.slice();
        next[i] = d;
        onChange(next.join('').trim());
    };

    const handleChange = (i, e) => {
        const v = e.target.value.replace(/\D/g, '').slice(-1);
        setDigit(i, v || ' ');
        if (v && i < length - 1) inputsRef.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i].trim() && i > 0) {
            inputsRef.current[i - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < length - 1) inputsRef.current[i + 1]?.focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(text);
        inputsRef.current[Math.min(text.length, length - 1)]?.focus();
    };

    return (
        <div className={styles.row}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i].trim()}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={styles.cell}
                />
            ))}
        </div>
    );
}