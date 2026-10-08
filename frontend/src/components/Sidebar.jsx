import { NavLink } from 'react-router-dom'
import Avatar from './Avatar'
import { users } from '@/mocks/data'

const NAV = [
    { to: '/app',          label: 'Лента',     stub: '(лента)', end: true },
    { to: '/app',          label: 'Поиск',     stub: '(поиск)' },
    { to: '/app',          label: 'Друзья',    stub: '(друзья)' },
    { to: '/app',          label: 'Сообщения', stub: '(чат)' },
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="sidebar__title">Главная</h2>

            <nav className="sidebar__nav">
                {NAV.map((n, i) => (
                    <NavLink
                        key={i}
                        to={n.to}
                        end={n.end}
                        className={({ isActive }) =>
                            `sidebar__item ${isActive && i === 0 ? 'sidebar__item--active' : ''}`
                        }
                    >
                        <span className="icon-stub">{n.stub}</span>
                        <span>{n.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__section-label">
                <span>Личные сообщения</span>
                <button className="icon-stub" title="Новое сообщение">+</button>
            </div>

            <ul>
                {users.slice(0, 4).map(u => (
                    <li key={u.id} className="sidebar__dm">
                        <Avatar label={u.avatar} size={32} />
                        <span>{u.name}</span>
                        <span className={`sidebar__dm-status sidebar__dm-status--${u.status}`}>
              {u.status === 'voice' ? 'в голосе' :
                  u.status === 'online' ? 'в сети' : 'не в сети'}
            </span>
                    </li>
                ))}
            </ul>

            <div className="sidebar__voice-card" style={{ marginTop: 'auto' }}>
                <div className="sidebar__voice-title">Голос подключён</div>
                <div className="sidebar__voice-sub">Комната 1 · Go-практика</div>
            </div>

            <div className="sidebar__user">
                <Avatar label="Вы" size={32} />
                <div>
                    <div className="sidebar__user-name">Вы</div>
                    <div className="sidebar__user-status">в сети</div>
                </div>
                <div className="sidebar__user-actions">
                    <span className="icon-stub" title="Микрофон">(мик)</span>
                    <span className="icon-stub" title="Наушники">(науш)</span>
                    <span className="icon-stub" title="Настройки">(шест)</span>
                </div>
            </div>
        </aside>
    )
}