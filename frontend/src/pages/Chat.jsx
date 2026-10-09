import { Link, useParams } from 'react-router-dom'
import { channels } from '@/mocks/data'

export default function Chat() {
    const { channelId } = useParams()
    const channel = channels.find(c => c.id === channelId) || channels[0]

    return (
        <div className="app-chat">
            {/* RAIL */}
            <aside className="app-rail">
                <div className="app-brand">✣</div>
                <Link to="/app" className="rail-btn">⌂</Link>
                <div className="rail-btn rail-btn--active">Go</div>
                <div className="rail-btn">Кр</div>
                <div className="rail-btn">De</div>
                <div className="rail-plus">+</div>
            </aside>

            {/* LEFT SIDEBAR */}
            <aside className="app-left app-left--chat">
                <h2>Go-практика <span>128</span></h2>

                <div className="section-label">ПОТОКИ</div>
                <Link className="app-left__item"> # общий</Link>
                <Link className="app-left__item app-left__item--selected"> # код-ревью</Link>
                <Link className="app-left__item"># вопросы-по-go <b>3</b></Link>
                <Link className="app-left__item"># вакансии</Link>

                <div className="section-label">ГОЛОС</div>
                <Link className="app-left__item">♟ Комната 1 <small>Ал Дм Вы</small></Link>
                <Link className="app-left__item">♧ Комната 2</Link>

                <div className="app-voice">
                    Голос подключён<br />
                    <small>Комната 1 · Go-практика</small>
                </div>
            </aside>

            {/* STREAM */}
            <main className="app-stream">
                <header className="stream-header">
                    <div>
                        <h1># {channel.name}</h1>
                        <small>{channel.desc} · разбираем код по пятницам</small>
                    </div>
                    <div className="stream-search">⌕ &nbsp; Поиск по потоку</div>
                    <button className="feed-invite">Пригласить</button>
                </header>

                <div className="messages">

                    <article className="msg-row">
                        <time>14:02</time>
                        <div className="avatar">А</div>
                        <div className="msg-body">
                            <strong>Алина</strong>
                            <p>Выложила хэндлер для постов. Посмотрите, пожалуйста, как я работаю с контекстом, кажется, что-то лишнее.</p>
                            <pre>{`func (s *Store) Get(ctx context.Context, id int64) (*Post, error) {
    row := s.db.QueryRowContext(ctx, id)
    return scanPost(row)
}`}</pre>
                            <div className="react">+1 2 &nbsp;&nbsp; <span>смотрю 1</span></div>
                        </div>
                    </article>

                    <article className="msg-row">
                        <time>14:09</time>
                        <div className="avatar avatar--orange">Д</div>
                        <div className="msg-body">
                            <strong>Дима</strong>
                            <p>Контекст передан правильно. Но ошибку <b>sql.ErrNoRows</b> лучше превратить в свою, иначе хэндлер будет знать про базу.</p>
                            <a className="thread">2 ответа в ветке</a>
                        </div>
                    </article>

                    <article className="msg-row">
                        <time>14:15</time>
                        <div className="avatar">Вы</div>
                        <div className="msg-body msg-body--mine">
                            Согласен. Предлагаю ввести ErrNotFound в слое хранилища и проверять через errors.Is.
                        </div>
                    </article>

                </div>

                <footer className="stream-composer">
                    <input placeholder={`Написать в ${channel.name}`} />
                    <button>→</button>
                </footer>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="app-right">
                <div className="right-tabs">
                    <b>Участники</b>
                    <span>Ветки</span>
                    <span>Файлы</span>
                </div>

                <h3>В ГОЛОСЕ — 4</h3>
                <div className="app-person"><i>Ал</i><span>Алина</span><em>говорит</em></div>
                <div className="app-person"><i>Дм</i><span>Дима</span></div>
                <div className="app-person"><i className="gray">Мк</i><span>Макс</span><em>без звука</em></div>
                <div className="app-person"><i>Вы</i><span>Вы</span></div>

                <h3>В СЕТИ — 1</h3>
                <div className="app-person"><i>Ир</i><span>Ирина</span><em>●</em></div>

                <h3>НЕ В СЕТИ — 1</h3>
                <div className="app-person"><i className="gray">Сш</i><span>Саша</span></div>

                <div className="thread-box">
                    <b>Ветка: ErrNotFound</b>
                    <small>2 ответа · Дима, Алина</small>
                </div>
            </aside>
        </div>
    )
}