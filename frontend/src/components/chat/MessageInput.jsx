import { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import IconStub from '../ui/IconStub';
import FileMessage from './FileMessage';
import styles from './MessageInput.module.css';

export default function MessageInput({ placeholder = 'Написать сообщение…' }) {
    const { sendMessage, activeChannelId } = useApp();
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const textareaRef = useRef(null);

    const handleSend = () => {
        const value = text.trim();
        if (!value && !attachments.length) return;

        sendMessage(value, attachments);
        setText('');
        setAttachments([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    };

    const handleFiles = (files) => {
        const list = Array.from(files).map((f) => ({
            id: `f-${Date.now()}-${f.name}`,
            name: f.name,
            size: f.size,
            type: f.type,
            status: 'uploading',
            url: '#',
        }));
        setAttachments((prev) => [...prev, ...list]);

        // Имитация загрузки
        list.forEach((item, i) => {
            setTimeout(() => {
                setAttachments((prev) =>
                    prev.map((a) => (a.id === item.id ? { ...a, status: 'uploaded' } : a))
                );
            }, 800 + i * 300);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const removeAttachment = (id) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div
            className={[styles.wrapper, dragOver ? styles.dragOver : ''].join(' ')}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {dragOver && <div className={styles.dropHint}>Перетащите файл сюда</div>}

            {attachments.length > 0 && (
                <div className={styles.attachments}>
                    {attachments.map((a) => (
                        <div key={a.id} className={styles.attachment}>
                            <FileMessage file={a} />
                            <button
                                className={styles.remove}
                                onClick={() => removeAttachment(a.id)}
                                type="button"
                                title="Удалить"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.row}>
                <label className={styles.attachBtn} title="Прикрепить файл">
                    <IconStub name="+" size={18} />
                    <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </label>

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className={styles.textarea}
                />

                <button
                    className={styles.send}
                    onClick={handleSend}
                    disabled={!text.trim() && !attachments.length}
                    type="button"
                    aria-label="Отправить"
                >
                    <IconStub name="➤" size={18} />
                </button>
            </div>
        </div>
    );
}