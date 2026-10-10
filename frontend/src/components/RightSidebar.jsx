import { useEffect, useState } from 'react'
import { api } from '@/api'
import Avatar from './Avatar'
import EmptyState from './EmptyState'

export default function RightSidebar({ roomId }) {
    const [tab, setTab] = useState('participants')
    const [room, setRoom] = useState(null)
    const [participants, setParticipants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function loadRoom() {
            setLoading(true)
            setError('')

            try {
                const rooms = await api.getVoiceRooms()
                if (!active) return

                const selected = roomId
                    ? rooms.find((item) => String(item.id) === String(roomId))
                    : null

                setRoom(selected || null)
                setParticipants(selected?.participants || [])
            } catch (err) {
                if (active) {
                    setRoom(null)
                    setParticipants([])
                    setError(err?.message || 'Не удалось загрузить участников')
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        loadRoom()

        return () => {
            active = false
        }
    }, [roomId])

    return (
        <aside className="rightbar">
            <div className="rightbar__tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'participants'}
                    className={`rightbar__tab ${
                        tab === 'participants' ? 'rightbar__tab--active' : ''
                    }`}
                    onClick={() => setTab('participants')}
                >
                    Участники
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'threads'}
                    className={`rightbar__tab ${
                        tab === 'threads' ? 'rightbar__tab--active' : ''
                    }`}
                    onClick={() => setTab('threads')}
                >
                    Ветки
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'files'}
                    className={`rightbar__tab ${
                        tab === 'files' ? 'rightbar__tab--active' : ''
                    }`}
                    onClick={() => setTab('files')}
                >
                    Файлы
                </button>
            </div>

            {loading && <p className="muted">Загрузка…</p>}

            {!loading && error && (
                <div className="rightbar__content">
                    <p className="auth-inline-error">{error}</p>
                </div>
            )}

            {!loading && !error && tab === 'participants' && (
                <div className="rightbar__content">
                    {room && (
                        <div className="rightbar__section-title">
                            В голосе — {participants.length}
                        </div>
                    )}

                    {!room && (
                        <EmptyState
                            title="Нет активной комнаты"
                            description="Участники голосовых комнат появятся здесь после подключения."
                        />
                    )}

                    {room && participants.length === 0 && (
                        <EmptyState
                            title="Пока никого нет"
                            description="Когда участники подключатся к комнате, они появятся здесь."
                        />
                    )}

                    {room && participants.length > 0 && (
                        <ul className="rightbar__users">
                            {participants.map((participant) => {
                                const user = typeof participant === 'object'
                                    ? participant
                                    : { id: participant, name: '' }

                                return (
                                    <li
                                        className="rightbar__user"
                                        key={user.id}
                                    >
                                        <Avatar
                                            src={user.avatarUrl || user.avatar}
                                            label={user.name}
                                            size={36}
                                        />
                                        <span className="rightbar__user-name">
                                            {user.displayName || user.name || 'Пользователь'}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            )}

            {!loading && !error && tab === 'threads' && (
                <EmptyState
                    title="Веток пока нет"
                    description="Ответы на сообщения будут отображаться здесь."
                />
            )}

            {!loading && !error && tab === 'files' && (
                <EmptyState
                    title="Файлов пока нет"
                    description="Прикреплённые к сообщениям файлы появятся здесь."
                />
            )}
        </aside>
    )
}