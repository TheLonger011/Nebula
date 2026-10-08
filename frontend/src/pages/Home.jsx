import { Link } from 'react-router-dom'

const CHANNELS = [
    { name: 'код-ревью',      desc: 'Go-практика' },
    { name: 'общий',          desc: 'Go-практика' },
    { name: 'вопросы-по-go',  desc: '3 новых' },
    { name: 'обсуждение',     desc: 'Курсовая' },
    { name: 'Wortschatz',     desc: 'Немецкий' },
    { name: 'вакансии',       desc: 'Go-практика' },
]

const SPACES = [
    { icon: '● • ●', name: 'Rust по-русски', members: '212 человек' },
    { icon: '◉',     name: 'Ночной код',     members: '86 человек' },
    { icon: '✦',     name: 'Дизайн-кухня',   members: '340 человек' },
    { icon: 'N',     name: 'Лофи-чат',       members: '1,2 тыс.' },
]

const FRIENDS = [
    { avatar: 'Ал', name: 'Алина', status: 'в голосе', online: true },
    { avatar: 'Дм', name: 'Дима',  status: 'в голосе', online: true },
    { avatar: 'Ир', name: 'Ирина', status: 'в сети',   online: true },
    { avatar: 'Сш', name: 'Саша',  status: 'не в сети', online: false },
]

export default function Home() {
    return (
        <div className="app-feed">
            {/* RAIL */}
            <aside className="app-rail">
                <div className="app-brand">✣</div>
                <div className="rail-btn rail-btn--active">⌂</div>
                <div className="rail-btn">Go</div>
                <div className="rail-btn">Кр</div>
                <div className="rail-btn">De</div>
                <div className="rail-plus">+</div>
            </aside>

            {/* LEFT SIDEBAR */}
            <aside className="app-left">
                <h2>Главная</h2>
                <nav>
                    <Link className="app-left__item app-left__item--selected">⌂ &nbsp; Лента</Link>
                    <Link className="app-left__item">⌕ &nbsp; Поиск</Link>
                    <Link className="app-left__item">♧ &nbsp; Друзья</Link>
                    <Link className="app-left__item">▢ &nbsp; Сообщения</Link>
                </nav>

                <div className="section-label">
                    ЛИЧНЫЕ СООБЩЕНИЯ <b>+</b>
                </div>

                {FRIENDS.map(f => (
                    <div key={f.name} className="app-person">
                        <i className={f.online ? '' : 'gray'}>{f.avatar}</i>
                        <span>{f.name}</span>
                        <em>{f.status}</em>
                    </div>
                ))}

                <div className="app-voice">
                    Голос подключён<br />
                    <small>Комната 1 · Go-практика</small>
                </div>
            </aside>

            {/* FEED */}
            <main className="app-feed-main">
                <header className="feed-header">
                    <div className="feed-search">⌕ &nbsp; Поиск...</div>
                    <div className="feed-tabs">
                        <b>Главная</b>
                        <span>Потоки</span>
                        <span>Люди</span>
                    </div>
                    <button className="feed-invite">Пригласить</button>
                </header>

                <h1>Добрый вечер</h1>

                <div className="channels">
                    {CHANNELS.map(ch => (
                        <Link key={ch.name} to={`/app/channels/${ch.name}`} className="channel-item">
                            <strong># &nbsp; {ch.name}</strong>
                            <small>{ch.desc}</small>
                            <b>→</b>
                        </Link>
                    ))}
                </div>

                <h2 className="feed-h2">
                    Пространства для вас <small>ПОКАЗАТЬ ВСЁ</small>
                </h2>

                <div className="spaces">
                    {SPACES.map(sp => (
                        <div key={sp.name} className="space-item">
                            <div className="space-icon">{sp.icon}</div>
                            <strong>{sp.name}</strong>
                            <small>{sp.members}</small>
                        </div>
                    ))}
                </div>

                <h2 className="feed-h2">Друзья</h2>
                <div className="friends">
                    {FRIENDS.map(f => (
                        <div key={f.name} className="friend-item">
                            {f.avatar}<br />
                            <strong>{f.name}</strong>
                            <small>{f.status}</small>
                        </div>
                    ))}
                </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="app-right">
                <div className="right-tabs">
                    <b>Сейчас</b>
                    <span>Активность</span>
                </div>

                <div className="right-room">
                    <div className="right-room__art">● ●<br />● ● ●</div>
                    <strong>Комната 1</strong>
                    <small>Go-практика · 4 в голосе</small>
                </div>

                <h3>Сейчас в комнате</h3>
                <div className="app-person"><span>🟡</span><span>Алина</span><em>говорит</em></div>
                <div className="app-person"><span>🟠</span><span>Дима</span></div>
                <div className="app-person"><span>⚫</span><span>Макс</span><em>без звука</em></div>
                <div className="app-person"><span>🟡</span><span>Вы</span></div>
            </aside>
        </div>
    )
}