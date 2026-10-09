import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import NavigationRail from '@/components/NavigationRail'
import RightSidebar from '@/components/RightSidebar'
import InviteDialog from '@/components/InviteDialog'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

export default function Home() {
    const [channels, setChannels] = useState([])
    const [spaces, setSpaces] = useState([])
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [inviteOpen, setInviteOpen] = useState(false)

    const load = async () => {
        setLoading(true); setError('')
        try {
            const [c, s, f] = await Promise.all([
                api.getChannels(),
                api.getSpaces(),
                api.getFriends(),
            ])
            setChannels(c); setSpaces(s); setFriends(f)
        } catch (e) {
            setError(e?.message || 'Не удалось загрузить главную')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__topbar">
                    <input className="main__search" placeholder="Поиск…" readOnly />
                    <nav className="main__tabs">
                        <span className="main__tab main__tab--active">Главная</span>
                        <Link to="/app/dm" className="main__tab">Потоки</Link>
                        <Link to="/app/friends" className="main__tab">Люди</Link>
                    </nav>
                    <button
                        type="button"
                        className="main__invite"
                        onClick={() => setInviteOpen(true)}
                    >
                        Пригласить
                    </button>
                </div>

                <div className="main__content">
                    <h1 className="main__hello">Добрый вечер</h1>

                    {loading && <p className="muted">Загрузка…</p>}

                    {error && (
                        <>
                            <p className="auth-inline-error">{error}</p>
                            <button className="btn btn--ghost" onClick={load}>Повторить</button>
                        </>
                    )}

                    {!loading && !error && channels.length === 0 && (
                        <EmptyState
                            icon="#"
                            title="Каналов пока нет"
                            description="Создайте первый канал в пространстве, чтобы начать общение."
                        />
                    )}

                    {!loading && !error && channels.length > 0 && (
                        <div className="channels">
                            {channels.map((ch) => (
                                <Link
                                    key={ch.id}
                                    to={`/app/channels/${ch.id}`}
                                    className="channel-card"
                                >
                                    <div className="channel-card__icon">#</div>
                                    <div className="channel-card__body">
                                        <div className="channel-card__name">{ch.name}</div>
                                        <div className="channel-card__desc">
                                            {ch.unread > 0 ? `${ch.unread} новых` : ch.desc}
                                        </div>
                                    </div>
                                    {ch.unread > 0 && (
                                        <span className="channel-card__badge">{ch.unread}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="section-head">
                        <h2 className="section-title">Пространства для вас</h2>
                        <Link to="/app/spaces" className="section-more">Показать всё</Link>
                    </div>

                    {!loading && !error && spaces.length === 0 && (
                        <p className="muted">Пока нет пространств</p>
                    )}

                    {!loading && !error && spaces.length > 0 && (
                        <div className="spaces">
                            {spaces.map((sp) => (
                                <Link
                                    key={sp.id}
                                    to={`/app/spaces/${sp.id}`}
                                    className="space-card"
                                >
                                    <div className="space-card__art">{sp.emoji}</div>
                                    <div className="space-card__name">{sp.name}</div>
                                    <div className="space-card__members">
                                        {sp.members.toLocaleString('ru-RU')} человек
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <h2 className="section-title" style={{ marginTop: 24 }}>Друзья</h2>

                    {!loading && !error && friends.length === 0 && (
                        <p className="muted">Список друзей пуст</p>
                    )}

                    {!loading && !error && friends.length > 0 && (
                        <div className="friends">
                            {friends.map((f) => (
                                <Link
                                    key={f.id}
                                    to={`/app/dm/${f.id}`}
                                    className="friend-card"
                                >
                                    <Avatar label={f.avatar} size={56} />
                                    <div className="friend-card__name">{f.name}</div>
                                    <div className={`friend-card__status friend-card__status--${f.status}`}>
                                        {f.status === 'voice' ? 'в голосе' :
                                            f.status === 'online' ? 'в сети' : 'не в сети'}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />

            <InviteDialog
                open={inviteOpen}
                spaceId={spaces[0]?.id}
                onClose={() => setInviteOpen(false)}
            />
        </div>
    )
}