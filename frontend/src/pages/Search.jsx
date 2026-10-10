import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

const TYPES = [
    { value: 'users', label: 'Люди' },
    { value: 'spaces', label: 'Пространства' },
    { value: 'messages', label: 'Сообщения' },
]

export default function Search() {
    const [type, setType] = useState('users')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)

    const search = async (event) => {
        event.preventDefault()

        const value = query.trim()
        if (!value) {
            setResults([])
            setSearched(false)
            setError('')
            return
        }

        setLoading(true)
        setError('')
        setSearched(true)

        try {
            const methods = {
                users: api.searchUsers,
                spaces: api.searchSpaces,
                messages: api.searchMessages,
            }

            const result = await methods[type](value)
            setResults(Array.isArray(result) ? result : [])
        } catch (err) {
            setResults([])
            setError(err?.message || 'Поиск временно недоступен')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title="Поиск" />

                    <form className="search-page__form" onSubmit={search}>
                        <label htmlFor="global-search">Что ищем?</label>

                        <input
                            id="global-search"
                            className="input"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Введите запрос"
                        />

                        <div className="search-page__types">
                            {TYPES.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`btn ${
                                        type === item.value
                                            ? 'btn--primary'
                                            : 'btn--ghost'
                                    }`}
                                    onClick={() => setType(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={loading || !query.trim()}
                        >
                            {loading ? 'Поиск…' : 'Найти'}
                        </button>
                    </form>

                    {error && <p className="auth-inline-error">{error}</p>}
                    {loading && <p className="muted">Поиск…</p>}

                    {!loading && !error && searched && results.length === 0 && (
                        <EmptyState
                            title="Ничего не найдено"
                            description="Попробуйте изменить поисковый запрос."
                        />
                    )}

                    {!loading && !error && results.length > 0 && (
                        <div className="search-page__results">
                            {results.map((item) => (
                                <div
                                    className="friend-row"
                                    key={`${type}-${item.id}`}
                                >
                                    {type === 'users' && (
                                        <>
                                            <Avatar
                                                src={item.avatarUrl || item.avatar}
                                                label={item.name}
                                                size={44}
                                            />
                                            <div className="friend-row__info">
                                                <div className="friend-row__name">
                                                    {item.displayName || item.name}
                                                </div>
                                                <div className="friend-row__status">
                                                    {item.username ? `@${item.username}` : ''}
                                                </div>
                                            </div>
                                            <Link
                                                className="btn btn--ghost"
                                                to={`/app/dm/${item.id}`}
                                            >
                                                Написать
                                            </Link>
                                        </>
                                    )}

                                    {type === 'spaces' && (
                                        <>
                                            <span
                                                className="icon-placeholder"
                                                aria-hidden="true"
                                            />
                                            <div className="friend-row__info">
                                                <div className="friend-row__name">
                                                    {item.name}
                                                </div>
                                                <div className="friend-row__status">
                                                    {item.description || ''}
                                                </div>
                                            </div>
                                            <Link
                                                className="btn btn--ghost"
                                                to={`/app/spaces/${item.id}`}
                                            >
                                                Открыть
                                            </Link>
                                        </>
                                    )}

                                    {type === 'messages' && (
                                        <>
                                            <div className="friend-row__info">
                                                <div className="friend-row__name">
                                                    {item.text}
                                                </div>
                                                <div className="friend-row__status">
                                                    {item.channelName || item.channelId}
                                                </div>
                                            </div>
                                            {item.channelId && (
                                                <Link
                                                    className="btn btn--ghost"
                                                    to={`/app/channels/${item.channelId}`}
                                                >
                                                    Перейти
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}