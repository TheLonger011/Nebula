import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const SPACES = [
    { id: 'go',  label: 'Go' },
    { id: 'kr',  label: 'Кр' },
    { id: 'de',  label: 'De' },
]

export default function NavigationRail() {
    return (
        <aside className="rail">
            <div className="rail__logo">
                <Logo size={42} />
            </div>

            <NavLink
                to="/app"
                end
                className={({ isActive }) => `rail__btn ${isActive ? 'rail__btn--active' : ''}`}
                title="Главная"
            >
                <span className="icon-stub">(дом)</span>
            </NavLink>

            <div className="rail__divider" />

            {SPACES.map(s => (
                <button key={s.id} className="rail__btn" title={s.label}>
                    {s.label}
                </button>
            ))}

            <button className="rail__btn rail__add" title="Создать пространство">
                +
            </button>
        </aside>
    )
}