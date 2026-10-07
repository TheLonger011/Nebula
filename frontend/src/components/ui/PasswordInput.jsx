import { useState } from 'react';
import Input from './Input';

export default function PasswordInput(props) {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <Input {...props} type={visible ? 'text' : 'password'} />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
                style={{
                    position: 'absolute',
                    right: 12,
                    top: props.label ? 30 : 10,
                    background: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: 14,
                }}
            >
                {visible ? '🙈' : '👁'}
            </button>
        </div>
    );
}