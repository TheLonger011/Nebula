import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

export default function Friends() {
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState({ incoming: [], outgoing: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [username, setUsername] = useState('')
    const [notice, setNotice] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const [friendList, friendRequests] = await Promise.all([
                api.getFriends(),
                api.getFriendRequests(),
            ])

            setFriends(Array.isArray(friendList) ? friendList : [])
            setRequests({
                incoming: friendRequests?.incoming || [],
                outgoing: friendRequests?.outgoing || [],
            })
        } catch (err) {
            setError(err?.message || 'Не удалось загрузить друзей')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const sendRequest = async (event) => {
        event.preventDefault()
        setNotice('')
        setError('')

        try {
            await api.sendFriendRequest({ username: username.trim() })
            setUsername('')
            setNotice('Заявка отправлена')
            await load()
        } catch (err) {
            setError(err?.message || 'Не удалось отправить заявку')
        }
    }

    const handleRequest = async (id, action) => {
        setError('')

        try {
            if (action === 'accept') {
                await api.acceptFriend(id)
            } else {
                await api.declineFriend(id)
            }

            await load()
        } catch (err) {
            setError(err?.message || 'Не удалось обработать заявку')
        }
    }

    const removeFriend = async (id) => {
        setError('')

        try {
            await api.removeFriend(id)
            await load()
        } catch (err) {
            setError(err?.message || 'Не удалось удалить пользователя')
        }
    }

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title="Друзья" />

                    <form className="friends__add-form" onSubmit={sendRequest}>
                        <label htmlFor="friend-username">
                            Добавить друга по username
                        </label>

                        <div className="friends__add-row">
                            <input
                                id="friend-username"
                                className="input"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="@username"
                                autoComplete="off"
                                required
                            />

                            <button
                                type="submit"
                                className="btn btn--primary"
                            >
                                Добавить
                            </button>
                        </div>
                    </form>

                    {notice && <p className="form-notice">{notice}</p>}
                    {error && <p className="auth-inline-error">{error}</p>}
                    {loading && <p className="muted">Загрузка…</p>}

                    {!loading && !error && (
                        <>
                            <section className="friends__section">
                                <h2 className="section-title">Входящие заявки</h2>

                                {requests.incoming.length === 0 ? (
                                    <p className="muted">Новых заявок нет</p>
                                ) : (
                                    <div className="friend-list">
                                        {requests.incoming.map((request) => (
                                            <div
                                                key={request.id}
                                                className="friend-row"
                                            >
                                                <Avatar
                                                    src={request.avatarUrl || request.avatar}
                                                    label={request.name}
                                                    size={44}
                                                />

                                                <div className="friend-row__info">
                                                    <div className="friend-row__name">
                                                        {request.displayName || request.name}
                                                    </div>
                                                    <div className="friend-row__status">
                                                        Заявка в друзья
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn--primary"
                                                    onClick={() =>
                                                        handleRequest(request.id, 'accept')
                                                    }
                                                >
                                                    Принять
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn--ghost"
                                                    onClick={() =>
                                                        handleRequest(request.id, 'decline')
                                                    }
                                                >
                                                    Отклонить
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="friends__section">
                                <h2 className="section-title">Мои друзья</h2>

                                {friends.length === 0 ? (
                                    <EmptyState
                                        title="Список друзей пуст"
                                        description="Найдите пользователя и отправьте ему заявку в друзья."
                                    />
                                ) : (
                                    <div className="friend-list">
                                        {friends.map((friend) => (
                                            <div
                                                key={friend.id}
                                                className="friend-row"
                                            >
                                                <Avatar
                                                    src={friend.avatarUrl || friend.avatar}
                                                    label={friend.name}
                                                    size={44}
                                                />

                                                <div className="friend-row__info">
                                                    <div className="friend-row__name">
                                                        {friend.displayName || friend.name}
                                                    </div>
                                                    <div className="friend-row__status">
                                                        {friend.status === 'online'
                                                            ? 'В сети'
                                                            : friend.status === 'offline'
                                                                ? 'Не в сети'
                                                                : 'Статус недоступен'}
                                                    </div>
                                                </div>

                                                <Link
                                                    className="btn btn--ghost"
                                                    to={`/app/dm/${friend.id}`}
                                                >
                                                    Написать
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="btn btn--ghost"
                                                    onClick={() => removeFriend(friend.id)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}