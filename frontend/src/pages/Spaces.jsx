import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

export function Spaces() {
    const [spaces, setSpaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const result = await api.getSpaces()
            setSpaces(Array.isArray(result) ? result : [])
        } catch (err) {
            setError(err?.message || 'Не удалось загрузить пространства')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title="Пространства" />

                    {loading && <p className="muted">Загрузка…</p>}

                    {!loading && error && (
                        <>
                            <p className="auth-inline-error">{error}</p>
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={load}
                            >
                                Повторить
                            </button>
                        </>
                    )}

                    {!loading && !error && spaces.length === 0 && (
                        <EmptyState
                            title="Пространств пока нет"
                            description="Создайте пространство или присоединитесь по приглашению."
                            action={
                                <Link
                                    to="/app/spaces/new"
                                    className="btn btn--primary"
                                >
                                    Создать пространство
                                </Link>
                            }
                        />
                    )}

                    {!loading && !error && spaces.length > 0 && (
                        <div className="spaces-grid">
                            {spaces.map((space) => (
                                <Link
                                    className="space-card"
                                    key={space.id}
                                    to={`/app/spaces/${space.id}`}
                                >
                                    <span
                                        className="space-card__icon icon-placeholder"
                                        aria-hidden="true"
                                    />
                                    <span className="space-card__name">
                                        {space.name}
                                    </span>
                                    <span className="space-card__description">
                                        {space.description || ''}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}

export function CreateSpace() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const submit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            const space = await api.createSpace({
                name: name.trim(),
                description: description.trim(),
            })

            navigate(`/app/spaces/${space.id}`)
        } catch (err) {
            setError(err?.message || 'Не удалось создать пространство')
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
                    <PageHeader title="Создать пространство" />

                    <form className="settings-form" onSubmit={submit}>
                        <div className="settings-form__field">
                            <label htmlFor="space-name">
                                Название
                            </label>
                            <input
                                id="space-name"
                                className="input"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={80}
                                required
                            />
                        </div>

                        <div className="settings-form__field">
                            <label htmlFor="space-description">
                                Описание
                            </label>
                            <textarea
                                id="space-description"
                                className="input"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={500}
                                rows={4}
                            />
                        </div>

                        {error && (
                            <p className="auth-inline-error">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={loading || !name.trim()}
                        >
                            {loading ? 'Создание…' : 'Создать'}
                        </button>
                    </form>
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}

export function SpaceDetails() {
    const { id } = useParams()
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const result = await api.getSpace(id)
            setSpace(result)
        } catch (err) {
            setSpace(null)
            setError(err?.message || 'Не удалось загрузить пространство')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="app-layout">
            <NavigationRail activeSpaceId={id} />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    {loading && <p className="muted">Загрузка…</p>}

                    {!loading && error && (
                        <>
                            <p className="auth-inline-error">{error}</p>
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={load}
                            >
                                Повторить
                            </button>
                        </>
                    )}

                    {!loading && !error && space && (
                        <>
                            <PageHeader title={space.name} />

                            {space.description && (
                                <p className="muted">{space.description}</p>
                            )}

                            <section className="spaces-section">
                                <h2 className="section-title">
                                    Текстовые каналы
                                </h2>

                                {space.channels?.length ? (
                                    <div className="space-channel-list">
                                        {space.channels.map((channel) => (
                                            <Link
                                                key={channel.id}
                                                className="space-channel"
                                                to={`/app/channels/${channel.id}`}
                                            >
                                                <span
                                                    className="icon-placeholder"
                                                    aria-hidden="true"
                                                />
                                                <span>{channel.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="Каналов пока нет"
                                        description="Текстовые каналы появятся после их создания."
                                    />
                                )}
                            </section>

                            <section className="spaces-section">
                                <h2 className="section-title">
                                    Голосовые комнаты
                                </h2>

                                {space.voiceRooms?.length ? (
                                    <div className="space-channel-list">
                                        {space.voiceRooms.map((room) => (
                                            <Link
                                                key={room.id}
                                                className="space-channel"
                                                to={`/app/voice/${room.id}`}
                                            >
                                                <span
                                                    className="icon-placeholder"
                                                    aria-hidden="true"
                                                />
                                                <span>{room.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="Голосовых комнат пока нет"
                                        description="Комнаты появятся после создания на сервере."
                                    />
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