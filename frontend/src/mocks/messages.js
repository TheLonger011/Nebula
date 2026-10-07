export const mockMessages = {
    c2: [
        {
            id: 'm1',
            channelId: 'c2',
            authorId: 'u1',
            text: 'Выполнила хендлер для постов. Посмотрите, пожалуйста, как я работаю с контекстом.',
            createdAt: '2026-10-07T14:02:00',
            status: 'delivered',
            code: `func (s *Store) Get(ctx context.Context, id int64) (*Post, error) {\n    row := s.db.QueryRowContext(ctx, id)\n    return scanPost(row)\n}`,
            codeLang: 'go',
        },
        {
            id: 'm2',
            channelId: 'c2',
            authorId: 'u2',
            text: 'Контекст передаёшь правильно. Но ошибку sql.ErrNoRows лучше превратить в свою, иначе хендлер будет знать про базу.',
            createdAt: '2026-10-07T14:09:00',
            status: 'delivered',
        },
        {
            id: 'm3',
            channelId: 'c2',
            authorId: 'me',
            text: 'Согласен. Предлагаю ввести ErrNotFound в слое хранилища и проверять через errors.Is.',
            createdAt: '2026-10-07T14:15:00',
            status: 'delivered',
        },
    ],
    c1: [],
};