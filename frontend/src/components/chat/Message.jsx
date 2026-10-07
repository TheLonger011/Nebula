import { formatTime } from '../../utils/formatTime';
import Avatar from '../ui/Avatar';
import CodeBlock from './CodeBlock';
import FileMessage from './FileMessage';
import VoiceMessage from './VoiceMessage';
import styles from './Message.module.css';

export default function Message({ message, author, isOwn, onRetry }) {
    const hasBody = message.text || message.code || message.file || message.voice;

    return (
        <article className={[styles.message, isOwn ? styles.own : ''].join(' ')}>
            <div className={styles.time}>{formatTime(message.createdAt)}</div>

            <div className={styles.line}>
                <span className={styles.dot} />
            </div>

            <div className={styles.body}>
                <header className={styles.header}>
                    <Avatar name={author.displayName} size={28} />
                    <span className={styles.author}>{author.displayName}</span>
                    {isOwn && <span className={styles.ownBadge}>вы</span>}
                </header>

                {message.text && <p className={styles.text}>{message.text}</p>}

                {message.code && (
                    <CodeBlock code={message.code} language={message.codeLang || 'text'} />
                )}

                {message.file && <FileMessage file={message.file} />}

                {message.voice && <VoiceMessage voice={message.voice} />}

                {message.status === 'sending' && (
                    <span className={styles.status}>отправляется…</span>
                )}

                {message.status === 'failed' && (
                    <div className={styles.failed}>
                        <span>не отправлено</span>
                        <button onClick={() => onRetry?.(message)}>Повторить</button>
                    </div>
                )}

                {!hasBody && !message.status && (
                    <span className={styles.status}>пустое сообщение</span>
                )}
            </div>
        </article>
    );
}