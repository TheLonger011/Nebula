import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationRail from '@/components/NavigationRail'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PageHeader from '@/components/PageHeader'
import { api } from '@/api'

export default function CreateSpace() {
    const nav = useNavigate()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!name.trim()) { setError('Введите название'); return }
        setLoading(true)
        try {
            const space = await api.createSpace({ name })
            nav(`/app/spaces/${space.id}`)
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

                    <form className="form-narrow" onSubmit={onSubmit}>
                        <label className="auth-label">
                            Название
                            <input
                                className="auth-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Например: Go-практика"
                                autoFocus
                            />
                        </label>

                        {error && <p className="auth-inline-error">{error}</p>}

                        <button className="btn btn--primary" type="submit" disabled={loading}>
                            {loading ? 'Создание…' : 'Создать'}
                        </button>
                    </form>
                </div>
            </main>

            <RightSidebar />
        </div>
    )
}