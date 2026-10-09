import { useState } from 'react'

export default function MessageComposer({ placeholder, onSend }) {
    const [text, setText] = useState('')

    const handleSend = () => {
        const t = text.trim()
        if (!t) return
        onSend(t)
        setText('')
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="chat__composer">
            <div className="chat__composer-inner">
                <input
                    className="chat__composer-input"
                    placeholder={placeholder}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKey}
                />
                <button className="chat__composer-send" onClick={handleSend} title="Отправить">
                    <span className="icon-stub">(→)</span>
                </button>
            </div>
        </div>
    )
}