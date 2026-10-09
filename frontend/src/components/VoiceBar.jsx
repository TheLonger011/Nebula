import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api'

export default function VoiceBar({ room, onLeave }) {
    const nav = useNavigate()
    const [leaving, setLeaving] = useState(false)

    if (!room) return null

    const leave = async () => {
        setLeaving(true)
        try {
            await api.leaveVoice(room.id)
            onLeave?.()
            nav('/app')
        } finally {
            setLeaving(false)
        }
    }

    return (
        <div className="voice-bar">
            <div className="voice-bar__info">
                <span className="voice-bar__label">Голос подключён</span>
                <span className="voice-bar__name">{room.name}</span>
            </div>
            <button
                type="button"
                className="voice-bar__leave"
                onClick={leave}
                disabled={leaving}
                title="Отключиться"
            >
                ⏏
            </button>
        </div>
    )
}