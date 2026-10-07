import { useState } from 'react';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ code, language = 'text' }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard недоступен
        }
    };

    return (
        <div className={styles.block}>
            <div className={styles.header}>
                <span className={styles.lang}>{language}</span>
                <button className={styles.copy} onClick={copy} type="button">
                    {copied ? 'Скопировано' : 'Копировать'}
                </button>
            </div>
            <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
        </div>
    );
}