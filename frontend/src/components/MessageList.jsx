import MessageItem from './MessageItem'

export default function MessageList({ messages, loading }) {
    if (loading) return <div className="chat__messages">Загрузка…</div>
    if (!messages.length) return <div className="chat__messages">Сообщений пока нет</div>

    return (
        <div className="chat__messages">
            {messages.map(m => <MessageItem key={m.id} message={m} />)}
        </div>
    )
}