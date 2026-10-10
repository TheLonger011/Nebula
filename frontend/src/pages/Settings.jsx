import { useCallback, useEffect, useState } from 'react'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import { api } from '@/api'

export default function Settings() {
    const [settings, setSettings] = useState(null)
    const [passwords, setPasswords] = useState({
        current: '',
        next: '',
        confirm: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const result = await api.getSettings()
            setSettings(result)
        } catch (err) {
            setError(err?.message || 'Не удалось загрузить настройки')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const updateSetting = (group, key, value) => {
        setSettings((previous) => ({
            ...previous,
            [group]: {
                ...previous[group],
                [key]: value,
            },
        }))
    }

    const saveSettings = async (event) => {
        event.preventDefault()
        setSaving(true)
        setError('')
        setNotice('')

        try {
            const updated = await api.updateSettings(settings)
            setSettings(updated)
            setNotice('Настройки сохранены')
        } catch (err) {
            setError(err?.message || 'Не удалось сохранить настройки')
        } finally {
            setSaving(false)
        }
    }

    const changePassword = async (event) => {
        event.preventDefault()
        setError('')
        setNotice('')

        if (passwords.next !== passwords.confirm) {
            setError('Новые пароли не совпадают')
            return
        }

        try {
            await api.changePassword({
                current: passwords.current,
                next: passwords.next,
            })

            setPasswords({ current: '', next: '', confirm: '' })
            setNotice('Пароль изменён')
        } catch (err) {
            setError(err?.message || 'Не удалось изменить пароль')
        }
    }

    return (
        <div className="app-layout">
            <NavigationRail />
            <Sidebar />

            <main className="main">
                <div className="main__content">
                    <PageHeader title="Настройки" />

                    {loading && <p className="muted">Загрузка…</p>}
                    {error && <p className="auth-inline-error">{error}</p>}
                    {notice && <p className="form-notice">{notice}</p>}

                    {!loading && settings && (
                        <>
                            <form
                                className="settings-form"
                                onSubmit={saveSettings}
                            >
                                <section className="settings-section">
                                    <h2 className="section-title">
                                        Внешний вид
                                    </h2>

                                    <div className="settings-form__field">
                                        <label htmlFor="settings-theme">
                                            Тема
                                        </label>
                                        <select
                                            id="settings-theme"
                                            className="input"
                                            value={settings.theme || 'dark'}
                                            onChange={(event) =>
                                                setSettings((previous) => ({
                                                    ...previous,
                                                    theme: event.target.value,
                                                }))
                                            }
                                        >
                                            <option value="dark">Тёмная</option>
                                            <option value="light">Светлая</option>
                                            <option value="system">Системная</option>
                                        </select>
                                    </div>

                                    <div className="settings-form__field">
                                        <label htmlFor="settings-language">
                                            Язык
                                        </label>
                                        <select
                                            id="settings-language"
                                            className="input"
                                            value={settings.language || 'ru'}
                                            onChange={(event) =>
                                                setSettings((previous) => ({
                                                    ...previous,
                                                    language: event.target.value,
                                                }))
                                            }
                                        >
                                            <option value="ru">Русский</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </section>

                                <section className="settings-section">
                                    <h2 className="section-title">
                                        Уведомления
                                    </h2>

                                    {Object.entries(settings.notifications || {}).map(
                                        ([key, value]) => (
                                            <label
                                                className="settings-toggle"
                                                key={key}
                                            >
                                                <span>{{
                                                    desktop: 'Уведомления',
                                                    sounds: 'Звуки',
                                                    mentions: 'Упоминания',
                                                }[key] || key}</span>

                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(value)}
                                                    onChange={(event) =>
                                                        updateSetting(
                                                            'notifications',
                                                            key,
                                                            event.target.checked
                                                        )
                                                    }
                                                />
                                            </label>
                                        )
                                    )}
                                </section>

                                <section className="settings-section">
                                    <h2 className="section-title">
                                        Приватность
                                    </h2>

                                    {Object.entries(settings.privacy || {}).map(
                                        ([key, value]) => (
                                            <label
                                                className="settings-toggle"
                                                key={key}
                                            >
                                                <span>{{
                                                    dmFromEveryone:
                                                        'Разрешить личные сообщения',
                                                    showOnlineStatus:
                                                        'Показывать статус в сети',
                                                }[key] || key}</span>

                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(value)}
                                                    onChange={(event) =>
                                                        updateSetting(
                                                            'privacy',
                                                            key,
                                                            event.target.checked
                                                        )
                                                    }
                                                />
                                            </label>
                                        )
                                    )}
                                </section>

                                <button
                                    className="btn btn--primary"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving ? 'Сохранение…' : 'Сохранить настройки'}
                                </button>
                            </form>

                            <form
                                className="settings-form settings-form--password"
                                onSubmit={changePassword}
                            >
                                <h2 className="section-title">
                                    Безопасность
                                </h2>

                                <div className="settings-form__field">
                                    <label htmlFor="password-current">
                                        Текущий пароль
                                    </label>
                                    <input
                                        id="password-current"
                                        className="input"
                                        type="password"
                                        autoComplete="current-password"
                                        value={passwords.current}
                                        onChange={(event) =>
                                            setPasswords((previous) => ({
                                                ...previous,
                                                current: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="settings-form__field">
                                    <label htmlFor="password-next">
                                        Новый пароль
                                    </label>
                                    <input
                                        id="password-next"
                                        className="input"
                                        type="password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        value={passwords.next}
                                        onChange={(event) =>
                                            setPasswords((previous) => ({
                                                ...previous,
                                                next: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="settings-form__field">
                                    <label htmlFor="password-confirm">
                                        Повторите новый пароль
                                    </label>
                                    <input
                                        id="password-confirm"
                                        className="input"
                                        type="password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        value={passwords.confirm}
                                        onChange={(event) =>
                                            setPasswords((previous) => ({
                                                ...previous,
                                                confirm: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    className="btn btn--primary"
                                    type="submit"
                                >
                                    Изменить пароль
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