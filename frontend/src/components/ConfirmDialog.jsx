import { useEffect } from 'react'

export default function ConfirmDialog({
                                          open, title, description, confirmLabel = 'Подтвердить',
                                          cancelLabel = 'Отмена', danger = false,
                                          onConfirm, onCancel,
                                      }) {
    useEffect(() => {
        if (!open) return undefined
        const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal__title">{title}</h3>
                {description && <p className="modal__desc">{description}</p>}
                <div className="modal__actions">
                    <button type="button" className="btn btn--ghost" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}