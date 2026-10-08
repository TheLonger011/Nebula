import Avatar from './Avatar'
import { users, currentUser } from '@/mocks/data'

function findAuthor(id) {
    if (id === 'me') return currentUser
    return users.find(u => u.id === id) || { name: 'Unknown', avatar: '?' }
}

export default function MessageItem({ message }) {
    const author = findAuthor(message.authorId)
    return (
        <div className={`message ${message.self ? 'message--self' : ''}`}>
            <div className="message__avatar">{author.avatar}</div>
            <div className="message__body">
                <div className="message__head">
                    <span className="message__author">{author.name}</span>
                    <span className="message__time">{message.time}</span>
                </div>

                <div className="message__text">{message.text}</div>

                {message.code && (
                    <pre className="code">{message.code}</pre>
                )}

                {message.reactions?.length > 0 && (
                    <div className="reactions">
                        {message.reactions.map((r, i) => (
                            <span key={i} className="reaction">{r.emoji} {r.count}</span>
                        ))}
                    </div>
                )}

                {message.thread && (
                    <span className="thread-link">
            {message.thread.replies} ответа в ветке
          </span>
                )}
            </div>
        </div>
    )
}