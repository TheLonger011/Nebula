import { useCallback, useEffect, useState } from 'react'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'
import { api } from '@/api'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [form, setForm] = useState({
        displayName: '',
        username: '',
        bio: '',
        birthDate: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const result = await api.getMe()
            setProfile(result)
            setForm({
                displayName: result?.displayName || result?.name || '',
                username: result?.username || '',
                bio: result?.bio || '',
                birthDate: result?.birthDate || '',
            })
        } catch (err) {
            setError(err?.message || 'Не удалось загрузить профиль')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const update = (field) => (event) => {
        setForm((previous) => ({
            ...previous,
            [field]: event.target.value,
        }))
    }

    const save = async (event) => {
        event.preventDefault()
        setSaving(true)
        setError('')
        setNotice('')

        try {
            const updated = await api.updateProfile({
                displayName: form.displayName.trim(),
                username: form.username.trim().replace(/^@/, ''),
                bio: form.bio.trim(),
                birthDate: form.birthDate || null,
            })

            setProfile(updated)
            setNotice('Изменения сохранены')
        } catch (err) {
            setError(err?.message || 'Не удалось сохранить изменения')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="page-loading">Загрузка профиля…</div>
    }

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title="Профиль" />

                    {error && <p className="auth-inline-error">{error}</p>}

                    {!profile && !error && (
                        <EmptyState
                            title="Профиль недоступен"
                            description="Не удалось получить данные аккаунта."
                            action={
                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={load}
                                >
                                    Повторить
                                </button>
                            }
                        />
                    )}

                    {profile && (
                        <>
                            <section className="profile-card">
                                <Avatar
                                    src={profile.avatarUrl || profile.avatar}
                                    label={profile.displayName || profile.name}
                                    size={88}
                                />

                                <div className="profile-card__identity">
                                    <h2>
                                        {profile.displayName ||
                                            profile.name ||
                                            'Имя не указано'}
                                    </h2>
                                    <p>
                                        {profile.username
                                            ? `@${profile.username}`
                                            : 'Username не указан'}
                                    </p>
                                    <p>{profile.email || 'Email не указан'}</p>
                                </div>
                            </section>

                            <form
                                className="profile-form"
                                onSubmit={save}
                            >
                                <div className="profile-form__field">
                                    <label htmlFor="profile-display-name">
                                        Отображаемое имя
                                    </label>
                                    <input
                                        id="profile-display-name"
                                        className="input"
                                        value={form.displayName}
                                        onChange={update('displayName')}
                                        maxLength={64}
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label htmlFor="profile-username">
                                        Username
                                    </label>
                                    <input
                                        id="profile-username"
                                        className="input"
                                        value={form.username}
                                        onChange={update('username')}
                                        maxLength={32}
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label htmlFor="profile-bio">
                                        О себе
                                    </label>
                                    <textarea
                                        id="profile-bio"
                                        className="input"
                                        value={form.bio}
                                        onChange={update('bio')}
                                        maxLength={500}
                                        rows={4}
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label htmlFor="profile-birth-date">
                                        Дата рождения
                                    </label>
                                    <input
                                        id="profile-birth-date"
                                        className="input"
                                        type="date"
                                        value={form.birthDate}
                                        onChange={update('birthDate')}
                                    />
                                </div>

                                <div className="profile-form__field">
                                    <label>Фотография профиля</label>
                                    <p className="muted">
                                        Загрузка фотографии будет работать через
                                        API после реализации backend-загрузки.
                                    </p>
                                </div>

                                {notice && (
                                    <p className="form-notice">{notice}</p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Сохранение…' : 'Сохранить изменения'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}