import { useEffect, useState } from 'react'
import { api } from '@/api'

export default function InviteDialog({ open, spaceId, onClose }) {
    const [invite, setInvite] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!open || !spaceId) return undefined
        setInvite(null); setError(''); setCopied(false); setLoading(true)
        api.createInvite({ spaceId })
            .then(setInvite)
            .catch((e) => setError(e?.message || 'Не удалось создать приглашение'))
            .finally(() => setLoading(false))
    }, [open, spaceId])

    useEffect(() => {
        if (!open) return undefined
        const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    if (!open) return null

    const copy = async () => {
        if (!invite?.url) return
        try {
            await navigator.clipboard.writeText(invite.url)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setError('Не удалось скопировать ссылку')
        }
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal__title">Приглашение</h3>
                {loading && <p className="modal__desc">Создаём ссылку…</p>}
                {error && <p className="modal__desc modal__desc--error">{error}</p>}
                {invite && (
                    <>
                        <p className="modal__desc">
                            Отправьте ссылку — она действует 7 дней.
                        </p>
                        <div className="invite-row">
                            <input className="invite-row__input" value={invite.url} readOnly />
                            <button type="button" className="btn btn--primary" onClick={copy}>
                                {copied ? 'Скопировано' : 'Копировать'}
                            </button>
                        </div>
                        <p className="modal__hint">Код: <code>{invite.code}</code></p>
                    </>
                )}
                <div className="modal__actions">
                    <button type="button" className="btn btn--ghost" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )
}