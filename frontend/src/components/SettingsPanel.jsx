import { useEffect, useState } from 'react'
import { api } from '@/api'

export default function SettingsPanel() {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        let alive = true
        api.getSettings()
            .then((s) => { if (alive) setSettings(s) })
            .catch((e) => { if (alive) setError(e?.message || 'Не удалось загрузить настройки') })
            .finally(() => { if (alive) setLoading(false) })
        return () => { alive = false }
    }, [])

    const patch = async (partial) => {
        const merged = { ...settings, ...partial }
        setSettings(merged)
        setSaved(false)
        try {
            await api.updateSettings(partial)
            setSaved(true)
            setTimeout(() => setSaved(false), 1200)
        } catch (e) {
            setError(e?.message || 'Не удалось сохранить')
        }
    }

    if (loading) return <p className="muted">Загрузка настроек…</p>
    if (error) return <p className="auth-inline-error">{error}</p>
    if (!settings) return null

    return (
        <div className="settings-panel">
            <section className="settings-block">
                <h3 className="settings-block__title">Внешний вид</h3>
                <label className="settings-row">
                    <span>Тема</span>
                    <select
                        value={settings.theme}
                        onChange={(e) => patch({ theme: e.target.value })}
                    >
                        <option value="dark">Тёмная</option>
                        <option value="light">Светлая</option>
                    </select>
                </label>
                <label className="settings-row">
                    <span>Язык</span>
                    <select
                        value={settings.language}
                        onChange={(e) => patch({ language: e.target.value })}
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                </label>
            </section>

            <section className="settings-block">
                <h3 className="settings-block__title">Уведомления</h3>
                <label className="settings-row">
                    <input
                        type="checkbox"
                        checked={settings.notifications.desktop}
                        onChange={(e) => patch({ notifications: { ...settings.notifications, desktop: e.target.checked } })}
                    />
                    <span>Уведомления на рабочем столе</span>
                </label>
                <label className="settings-row">
                    <input
                        type="checkbox"
                        checked={settings.notifications.sounds}
                        onChange={(e) => patch({ notifications: { ...settings.notifications, sounds: e.target.checked } })}
                    />
                    <span>Звуки сообщений</span>
                </label>
                <label className="settings-row">
                    <input
                        type="checkbox"
                        checked={settings.notifications.mentions}
                        onChange={(e) => patch({ notifications: { ...settings.notifications, mentions: e.target.checked } })}
                    />
                    <span>Только упоминания</span>
                </label>
            </section>

            <section className="settings-block">
                <h3 className="settings-block__title">Приватность</h3>
                <label className="settings-row">
                    <input
                        type="checkbox"
                        checked={settings.privacy.dmFromEveryone}
                        onChange={(e) => patch({ privacy: { ...settings.privacy, dmFromEveryone: e.target.checked } })}
                    />
                    <span>Личные сообщения от всех</span>
                </label>
                <label className="settings-row">
                    <input
                        type="checkbox"
                        checked={settings.privacy.showOnlineStatus}
                        onChange={(e) => patch({ privacy: { ...settings.privacy, showOnlineStatus: e.target.checked } })}
                    />
                    <span>Показывать статус «в сети»</span>
                </label>
            </section>

            {saved && <p className="settings-saved">Сохранено</p>}
        </div>
    )
}