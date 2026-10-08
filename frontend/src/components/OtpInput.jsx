import { useRef } from 'react'

export default function OtpInput({ length = 6, value, onChange }) {
    const refs = useRef([])
    const cells = value.split('').concat(Array(length).fill('')).slice(0, length)

    const handleChange = (i, val) => {
        const digit = val.replace(/\D/g, '').slice(-1)
        const next = [...cells]
        next[i] = digit
        onChange(next.join(''))
        if (digit && i < length - 1) refs.current[i + 1]?.focus()
    }

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !cells[i] && i > 0) refs.current[i - 1]?.focus()
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
        onChange(text)
        const last = Math.min(text.length, length - 1)
        refs.current[last]?.focus()
    }

    return (
        <div className="otp">
            {cells.map((c, i) => (
                <input
                    key={i}
                    ref={el => (refs.current[i] = el)}
                    className="otp__cell"
                    value={c}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                />
            ))}
        </div>
    )
}