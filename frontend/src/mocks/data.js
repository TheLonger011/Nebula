export const currentUser = { id: 'me', name: 'Вы', avatar: 'Вы', status: 'online' }

export const users = [
    { id: 'u1', name: 'Алина', avatar: 'Ал', status: 'voice' },
    { id: 'u2', name: 'Дима',  avatar: 'Дм', status: 'voice' },
    { id: 'u3', name: 'Ирина', avatar: 'Ир', status: 'online' },
    { id: 'u4', name: 'Саша',  avatar: 'Сш', status: 'offline' },
    { id: 'u5', name: 'Макс',  avatar: 'Мк', status: 'voice' },
]

export const channels = [
    { id: 'code-review',  name: 'код-ревью',     desc: 'Go-практика', unread: 0 },
    { id: 'general',      name: 'общий',         desc: 'Go-практика', unread: 0 },
    { id: 'go-questions', name: 'вопросы-по-go', desc: 'Go-практика', unread: 3 },
    { id: 'discussion',   name: 'обсуждение',    desc: 'Курсовая',    unread: 0 },
    { id: 'wortschatz',   name: 'Wortschatz',    desc: 'Немецкий',    unread: 0 },
    { id: 'jobs',         name: 'вакансии',      desc: 'Go-практика', unread: 0 },
]

export const spaces = [
    { id: 'rust',   name: 'Rust по-русски', members: 212,  emoji: '🦀' },
    { id: 'night',  name: 'Ночной код',     members: 86,   emoji: '🌙' },
    { id: 'design', name: 'Дизайн-кухня',   members: 340,  emoji: '🎨' },
    { id: 'lofi',   name: 'Лофи-чат',       members: 1200, emoji: '🎧' },
]

export const messagesStore = {
    'code-review': [
        {
            id: 'm1',
            authorId: 'u1',
            time: '14:02',
            text: 'Выложила хэндлер для постов. Посмотрите, пожалуйста, как я работаю с контекстом, кажется, что-то лишнее.',
            code: `func (s *Store) Get(ctx context.Context, id int64) (*Post, error) {
    row := s.db.QueryRowContext(ctx, q, id)
    return scanPost(row)
}`,
            reactions: [{ emoji: '+1', count: 2 }],
        },
        {
            id: 'm2',
            authorId: 'u2',
            time: '14:09',
            text: 'Контекст передан правильно. Но ошибку sql.ErrNoRows лучше превратить в свою, иначе хендлер будет знать про базу.',
            reactions: [{ emoji: '+1', count: 1 }],
            thread: { title: 'ErrNotFound', replies: 2, participants: ['Дима', 'Алина'] },
        },
        {
            id: 'm3',
            authorId: 'me',
            time: '14:15',
            text: 'Согласен. Предлагаю ввести ErrNotFound в слое хранилища и проверять через errors.Is.',
            self: true,
            reactions: [],
        },
    ],
}