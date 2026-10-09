import MessageItem from './MessageItem'

export default function MessageList({ messages, authorsById = {}, loading, error, onRetry }) {
    if (loading) return <div className="chat__messages"><p className="muted">Загрузка сообщений…</p></div>

    if (error) {
        return (
            <div className="chat__messages">
                <p className="auth-inline-error">{error}</p>
                {onRetry && (
                    <button type="button" className="btn btn--ghost" onClick={onRetry}>
                        Повторить
                    </button>
                )}
            </div>
        )
    }

    if (!messages.length) {
        return (
            <div className="chat__messages">
                <p className="muted">Сообщений пока нет — напишите первым.</p>
            </div>
        )
    }

    return (
        <div className="chat__messages">
            {messages.map((m) => (
                <MessageItem
                    key={m.id}
                    message={m}
                    author={authorsById[m.authorId]}
                />
            ))}
        </div>
    )
}