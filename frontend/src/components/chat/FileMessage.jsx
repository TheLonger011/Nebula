import { useState } from 'react';
import { formatFileSize } from '../../utils/formatTime';
import styles from './FileMessage.module.css';

export default function FileMessage({ file }) {
    const [progress, setProgress] = useState(file.status === 'uploaded' ? 100 : 0);

    // Имитация загрузки (пока нет backend)
    useState(() => {
        if (file.status === 'uploading') {
            const t = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        clearInterval(t);
                        return 100;
                    }
                    return p + 10;
                });
            }, 200);
        }
    });

    const isUploading = file.status === 'uploading' && progress < 100;
    const isFailed = file.status === 'failed';

    return (
        <div className={[styles.file, isFailed ? styles.failed : ''].join(' ')}>
            <div className={styles.icon}>📄</div>

            <div className={styles.info}>
                <span className={styles.name}>{file.name}</span>
                <span className={styles.size}>{formatFileSize(file.size)}</span>

                {isUploading && (
                    <div className={styles.progress}>
                        <div className={styles.bar} style={{ width: `${progress}%` }} />
                    </div>
                )}

                {isFailed && <span className={styles.error}>Ошибка загрузки</span>}
            </div>

            {file.status === 'uploaded' && (
                <a href={file.url} className={styles.download} download={file.name}>
                    Скачать
                </a>
            )}

            {isFailed && (
                <button className={styles.retry} type="button">
                    Повторить
                </button>
            )}
        </div>
    );
}
