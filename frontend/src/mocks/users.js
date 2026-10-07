export const mockUsers = [
    { id: 'u1', username: 'alina_dev', displayName: 'Алина', avatar: null, status: 'online', inVoice: true, speaking: true },
    { id: 'u2', username: 'dima', displayName: 'Дима', avatar: null, status: 'online', inVoice: true, speaking: true },
    { id: 'u3', username: 'irina', displayName: 'Ирина', avatar: null, status: 'online', inVoice: false, speaking: false },
    { id: 'u4', username: 'maks', displayName: 'Макс', avatar: null, status: 'online', inVoice: true, speaking: false, muted: true },
    { id: 'u5', username: 'sasha', displayName: 'Саша', avatar: null, status: 'offline', inVoice: false, speaking: false },
];

export const getUserById = (id) => mockUsers.find((u) => u.id === id);