import { useState } from 'react'

export default function MessageComposer({
                                            placeholder = 'Написать сообщение',
                                            onSend,
                                            disabled = false,
                                        }) {
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        const value = text.trim()

        if (!value || sending || disabled) return

        setSending(true)

        try {
            await onSend(value)
            setText('')
        } finally {
            setSending(false)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="chat__composer">
            <div className="chat__composer-inner">
                <textarea
                    className="chat__composer-input"
                    placeholder={placeholder}
                    value={text}
                    disabled={disabled || sending}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    aria-label={placeholder}
                />

                <button
                    type="button"
                    className="chat__composer-send"
                    onClick={handleSend}
                    disabled={disabled || sending || !text.trim()}
                    title="Отправить"
                    aria-label="Отправить сообщение"
                >
                    <span
                        className="icon-placeholder"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    )
}