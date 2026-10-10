import {
    users,
    channels,
    spaces,
    messagesStore,
    currentUser,
    friends,
    incomingRequests,
    outgoingRequests,
    directMessages,
    voiceRooms,
    settingsDefaults,
} from '@/mocks/data'
import { ApiError } from '@/api/client'

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const fail = (message, code = '') => {
    throw new ApiError(message, { status: 400, code })
}

const initials = (name = '') => name.trim().slice(0, 2)

const state = {
    users: [...users],
    friends: [...friends],
    incoming: [...incomingRequests],
    outgoing: [...outgoingRequests],
    spaces: [...spaces],
    channels: [...channels],
    messagesStore: { ...messagesStore },
    dm: { ...directMessages },
    voice: [...voiceRooms],
    settings: { ...settingsDefaults },
    profile: { ...currentUser },
}

export const mockApi = {
    async login({ login, password }) {
        await wait()

        if (!login || !password) fail('Введите логин и пароль')

        const isEmail = login.includes('@')

        return {
            token: 'mock-token',
            user: {
                ...state.profile,
                ...(isEmail ? { email: login } : { username: login }),
            },
        }
    },

    async sendCode({ email }) {
        await wait()
        if (!email) fail('Введите почту')
        return { ok: true }
    },

    async verifyCode({ email, code }) {
        await wait()
        if (!email) fail('Почта не указана')
        if (!/^\d{6}$/.test(code)) {
            fail('Введите 6-значный код', 'INVALID_CODE')
        }

        return { ok: true, ticket: 'mock-ticket' }
    },

    async completeProfile({ email, ticket, username, displayName, birthDate }) {
        await wait()

        if (!email || !ticket) {
            fail('Подтвердите почту, чтобы продолжить')
        }

        const user = {
            ...state.profile,
            email,
            username,
            name: displayName,
            displayName,
            avatar: '',
            ...(birthDate ? { birthDate } : {}),
        }

        state.profile = user
        return { token: 'mock-token', user }
    },

    async recover({ email }) {
        await wait()
        if (!email) fail('Введите почту')
        return { ok: true }
    },

    async resetPassword({ email, code, password }) {
        await wait()

        if (!email) fail('Почта не указана')
        if (!/^\d{6}$/.test(code)) {
            fail('Введите 6-значный код', 'INVALID_CODE')
        }
        if (!password || password.length < 8) {
            fail('Пароль должен содержать минимум 8 символов')
        }

        return { ok: true }
    },

    async getMe() {
        await wait()
        return { ...state.profile }
    },

    async updateProfile(patch) {
        await wait()
        state.profile = { ...state.profile, ...patch }
        return { ...state.profile }
    },

    async getSettings() {
        await wait()
        return { ...state.settings }
    },

    async updateSettings(patch) {
        await wait()
        state.settings = { ...state.settings, ...patch }
        return { ...state.settings }
    },

    async changePassword({ current, next }) {
        await wait()

        if (!current || !next) fail('Заполните поля')
        if (next.length < 8) {
            fail('Пароль должен содержать минимум 8 символов')
        }

        return { ok: true }
    },

    async getSpaces() {
        await wait()
        return state.spaces.map((space) => ({ ...space }))
    },

    async getSpace(id) {
        await wait()

        const space = state.spaces.find((item) => item.id === id)
        if (!space) fail('Пространство не найдено', 'NOT_FOUND')

        return {
            ...space,
            channels: state.channels.filter((channel) => channel.spaceId === id),
            voiceRooms: state.voice.filter((room) => room.spaceId === id),
        }
    },

    async getChannels(spaceId) {
        await wait()

        return spaceId
            ? state.channels.filter((channel) => channel.spaceId === spaceId)
            : [...state.channels]
    },

    async createSpace({ name }) {
        await wait()

        if (!name?.trim()) fail('Введите название')

        const space = {
            id: `sp-${Date.now()}`,
            name: name.trim(),
            members: 1,
            icon: null,
        }

        state.spaces.push(space)
        return space
    },

    async getMessages(channelId) {
        await wait()
        return (state.messagesStore[channelId] || []).map((message) => ({ ...message }))
    },

    async sendMessage(channelId, content) {
        await wait(150)

        const text = content?.trim()
        if (!text) fail('Пустое сообщение')

        const message = {
            id: `m-${Date.now()}`,
            authorId: 'me',
            time: new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            text,
            self: true,
            reactions: [],
            createdAt: new Date().toISOString(),
        }

        if (!state.messagesStore[channelId]) {
            state.messagesStore[channelId] = []
        }

        state.messagesStore[channelId].push(message)
        return { ...message }
    },

    async getFriends() {
        await wait()
        return state.friends.map((friend) => ({ ...friend }))
    },

    async getFriendRequests() {
        await wait()

        return {
            incoming: state.incoming.map((request) => ({ ...request })),
            outgoing: state.outgoing.map((request) => ({ ...request })),
        }
    },

    async acceptFriend(id) {
        await wait()

        const request = state.incoming.find((item) => item.id === id)
        if (!request) fail('Заявка не найдена', 'NOT_FOUND')

        state.incoming = state.incoming.filter((item) => item.id !== id)
        state.friends.push({
            id: request.id,
            name: request.name,
            avatar: request.avatar || '',
            status: 'offline',
            since: new Date().toISOString().slice(0, 10),
        })

        return { ok: true }
    },

    async declineFriend(id) {
        await wait()
        state.incoming = state.incoming.filter((item) => item.id !== id)
        return { ok: true }
    },

    async removeFriend(id) {
        await wait()
        state.friends = state.friends.filter((item) => item.id !== id)
        return { ok: true }
    },

    async sendFriendRequest({ username }) {
        await wait()

        if (!username?.trim()) fail('Введите username')

        const normalized = username.replace(/^@/, '')
        const user = state.users.find((item) => item.username === normalized)

        if (!user) fail('Пользователь не найден', 'NOT_FOUND')

        const request = {
            id: `r-${Date.now()}`,
            name: user.name,
            avatar: user.avatar || '',
            username: user.username,
        }

        state.outgoing.push(request)
        return request
    },

    async searchUsers(query) {
        await wait(180)

        const normalized = (query || '').trim().toLowerCase()
        if (!normalized) return []

        return state.users
            .filter((user) =>
                (user.name || '').toLowerCase().includes(normalized) ||
                (user.username || '').toLowerCase().includes(normalized)
            )
            .slice(0, 20)
            .map((user) => ({ ...user }))
    },

    async searchSpaces(query) {
        await wait(180)

        const normalized = (query || '').trim().toLowerCase()
        if (!normalized) return []

        return state.spaces
            .filter((space) => space.name.toLowerCase().includes(normalized))
            .slice(0, 20)
            .map((space) => ({ ...space }))
    },

    async searchMessages(query) {
        await wait(180)

        const normalized = (query || '').trim().toLowerCase()
        if (!normalized) return []

        const results = []

        for (const [channelId, messages] of Object.entries(state.messagesStore)) {
            for (const message of messages) {
                if (message.text?.toLowerCase().includes(normalized)) {
                    results.push({ ...message, channelId })
                }
            }
        }

        return results.slice(0, 50)
    },

    async getDmConversations() {
        await wait()

        return state.friends.map((friend) => {
            const messages = state.dm[friend.id] || []

            return {
                userId: friend.id,
                name: friend.name,
                avatar: friend.avatar || '',
                status: friend.status,
                last: messages[messages.length - 1] || null,
            }
        })
    },

    async getDmMessages(userId) {
        await wait()
        return (state.dm[userId] || []).map((message) => ({ ...message }))
    },

    async sendDm(userId, content) {
        await wait(150)

        const text = content?.trim()
        if (!text) fail('Пустое сообщение')

        const message = {
            id: `dm-${Date.now()}`,
            from: 'me',
            text,
            time: new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }

        if (!state.dm[userId]) state.dm[userId] = []
        state.dm[userId].push(message)

        return { ...message }
    },

    async getVoiceRooms(spaceId) {
        await wait()

        return state.voice
            .filter((room) => !spaceId || room.spaceId === spaceId)
            .map((room) => ({ ...room }))
    },

    async joinVoice(roomId) {
        await wait()

        const room = state.voice.find((item) => item.id === roomId)
        if (!room) fail('Комната не найдена', 'NOT_FOUND')

        if (!room.participants.includes('me')) {
            room.participants.push('me')
        }

        room.members = room.participants.length
        return { ...room }
    },

    async leaveVoice(roomId) {
        await wait()

        const room = state.voice.find((item) => item.id === roomId)

        if (room) {
            room.participants = room.participants.filter((id) => id !== 'me')
            room.members = room.participants.length
        }

        return { ok: true }
    },

    async createInvite({ spaceId }) {
        await wait()

        if (!spaceId) fail('Пространство не указано')

        const code = Math.random().toString(36).slice(2, 10)

        return {
            code,
            url: `${window.location.origin}/invite/${code}`,
            spaceId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
    },

    async acceptInvite({ code }) {
        await wait()

        if (!code) fail('Код не указан')

        const space = state.spaces[0]
        if (!space) fail('Нет доступных пространств', 'NOT_FOUND')

        return { space }
    },
}