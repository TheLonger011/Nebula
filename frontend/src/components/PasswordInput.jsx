import { useState } from 'react'
import Input from './Input'

export default function PasswordInput({ label, ...rest }) {
    const [visible, setVisible] = useState(false)
    return (
        <Input
            label={label}
            type={visible ? 'text' : 'password'}
            icon={
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    style={{ color: 'inherit', display: 'grid', placeItems: 'center' }}
                    aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
                >
                    <span className="icon-stub">(иконка глаза)</span>
                </button>
            }
            {...rest}
        />
    )
}