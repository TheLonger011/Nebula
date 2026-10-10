import { useState } from 'react'
import Avatar from './Avatar'
import { users } from '@/mocks/data'

export default function RightSidebar() {
    const [tab, setTab] = useState('now')

    const room = [
        { id: 'u1', name: 'Алина', avatar: 'Ал', state: 'speaking' },
        { id: 'u2', name: 'Дима',  avatar: 'Дм', state: 'idle' },
        { id: 'u5', name: 'Макс',  avatar: 'Мк', state: 'muted' },
        { id: 'me', name: 'Вы',    avatar: 'Вы', state: 'idle' },
    ]

    return (
        <aside className="rightbar">
            <div className="rightbar__tabs">
                <button
                    className={`rightbar__tab ${tab === 'now' ? 'rightbar__tab--active' : ''}`}
                    onClick={() => setTab('now')}
                >
                    Сейчас
                </button>
                <button
                    className={`rightbar__tab ${tab === 'activity' ? 'rightbar__tab--active' : ''}`}
                    onClick={() => setTab('activity')}
                >
                    Активность
                </button>
            </div>

            <div className="voice-card">
                <div className="voice-card__art">voice</div>
                <div className="voice-card__info">
                    <div className="voice-card__name">Комната 1</div>
                    <div className="voice-card__sub">Go-практика · 4 в голосе</div>
                </div>
            </div>

            <div className="rightbar__section-title">Сейчас в комнате</div>
            <ul>
                {room.map(u => (
                    <li key={u.id} className="rightbar__user">
                        <Avatar label={u.avatar} size={36} />
                        <span className="rightbar__user-name">{u.name}</span>
                        <span className={`rightbar__user-state rightbar__user-state--${u.state}`}>
              {u.state === 'speaking' ? 'говорит' :
                  u.state === 'muted' ? 'без звука' : ''}
            </span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}