import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

export default function VoiceRoom() {
    const { roomId } = useParams()
    const [rooms, setRooms] = useState([])
    const [room, setRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const result = await api.getVoiceRooms()
            const list = Array.isArray(result) ? result : []
            setRooms(list)
            setRoom(list.find((item) => String(item.id) === String(roomId)) || null)
        } catch (err) {
            setError(err?.message || 'Не удалось загрузить голосовые комнаты')
        } finally {
            setLoading(false)
        }
    }, [roomId])

    useEffect(() => {
        load()
    }, [load])

    const join = async () => {
        setBusy(true)
        setError('')
        setNotice('')

        try {
            const updated = await api.joinVoice(roomId)
            setRoom(updated)
            setNotice(
                'Вы присоединились к комнате. Передача аудио потребует подключения голосового сервера.'
            )
        } catch (err) {
            setError(err?.message || 'Не удалось подключиться')
        } finally {
            setBusy(false)
        }
    }

    const leave = async () => {
        setBusy(true)
        setError('')
        setNotice('')

        try {
            await api.leaveVoice(roomId)
            await load()
            setNotice('Вы вышли из комнаты')
        } catch (err) {
            setError(err?.message || 'Не удалось выйти из комнаты')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title={room?.name || 'Голосовая комната'} />

                    {loading && <p className="muted">Загрузка…</p>}
                    {error && <p className="auth-inline-error">{error}</p>}
                    {notice && <p className="form-notice">{notice}</p>}

                    {!loading && !error && !room && (
                        <EmptyState
                            title="Комната не найдена"
                            description="Проверьте ссылку или выберите комнату из списка."
                        />
                    )}

                    {!loading && !error && room && (
                        <section className="voice-room">
                            <div className="voice-room__status">
                                <span
                                    className="icon-placeholder"
                                    aria-hidden="true"
                                />
                                <span>
                                    Участников: {room.members ?? room.participants?.length ?? 0}
                                </span>
                            </div>

                            <p className="muted">
                                Интерфейс подключения готов. Для реального
                                голосового общения потребуется WebRTC и
                                signaling-сервис на backend.
                            </p>

                            <div className="voice-room__actions">
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    onClick={join}
                                    disabled={busy}
                                >
                                    {busy ? 'Подключение…' : 'Подключиться'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={leave}
                                    disabled={busy}
                                >
                                    Отключиться
                                </button>
                            </div>

                            <h2 className="section-title">Комнаты</h2>

                            {rooms.length === 0 ? (
                                <EmptyState
                                    title="Комнат пока нет"
                                    description="Список появится после загрузки данных."
                                />
                            ) : (
                                <div className="space-channel-list">
                                    {rooms.map((item) => (
                                        <Link
                                            key={item.id}
                                            className="space-channel"
                                            to={`/app/voice/${item.id}`}
                                        >
                                            <span
                                                className="icon-placeholder"
                                                aria-hidden="true"
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <h2 className="section-title">Участники</h2>

                            {!room.participants?.length ? (
                                <p className="muted">
                                    Данные об участниках пока недоступны.
                                </p>
                            ) : (
                                <div className="friend-list">
                                    {room.participants.map((participant) => {
                                        const user = typeof participant === 'object'
                                            ? participant
                                            : { id: participant, name: '' }

                                        return (
                                            <div
                                                className="friend-row"
                                                key={user.id}
                                            >
                                                <Avatar
                                                    src={user.avatarUrl || user.avatar}
                                                    label={user.name}
                                                    size={40}
                                                />
                                                <span>
                                                    {user.displayName ||
                                                        user.name ||
                                                        'Пользователь'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            <RightSidebar roomId={roomId} />
        </div>
    )
}