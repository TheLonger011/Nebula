import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { api } from '@/api'
import { useAuth } from '@/context/AuthContext'

const NAV = [
    { to: '/app', label: 'Лента', end: true },
    { to: '/app/search', label: 'Поиск' },
    { to: '/app/friends', label: 'Друзья' },
    { to: '/app/dm', label: 'Сообщения' },
    { to: '/app/profile', label: 'Профиль' },
    { to: '/app/settings', label: 'Настройки' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true

        api.getFriends()
            .then((result) => {
                if (alive) setFriends(result)
            })
            .catch(() => {
                if (alive) setFriends([])
            })
            .finally(() => {
                if (alive) setLoading(false)
            })

        return () => {
            alive = false
        }
    }, [])

    return (
        <aside className="sidebar">
            <h2 className="sidebar__title">Главная</h2>

            <nav className="sidebar__nav">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `sidebar__item ${
                                isActive ? 'sidebar__item--active' : ''
                            }`
                        }
                    >
                        <span
                            className="icon-placeholder"
                            aria-hidden="true"
                        />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__section-label">
                <span>Личные сообщения</span>

                <button
                    type="button"
                    className="icon-placeholder icon-placeholder--button"
                    title="Новое сообщение"
                    aria-label="Новое сообщение"
                    onClick={() => navigate('/app/dm')}
                />
            </div>

            {loading && (
                <p className="sidebar__empty">Загрузка…</p>
            )}

            {!loading && friends.length === 0 && (
                <p className="sidebar__empty">Пока никого нет</p>
            )}

            <ul>
                {friends.map((friend) => (
                    <li
                        key={friend.id}
                        className="sidebar__dm"
                        onClick={() => navigate(`/app/dm/${friend.id}`)}
                    >
                        <Avatar label={friend.avatar} size={32} />

                        <span>{friend.name}</span>

                        <span
                            className={`sidebar__dm-status sidebar__dm-status--${friend.status}`}
                        >
                            {friend.status === 'voice'
                                ? 'в голосе'
                                : friend.status === 'online'
                                    ? 'в сети'
                                    : 'не в сети'}
                        </span>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="sidebar__logout"
                onClick={logout}
            >
                Выйти
            </button>
        </aside>
    )
}