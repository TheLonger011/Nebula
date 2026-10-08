import {
    users,
    channels,
    spaces,
    messagesStore,
    currentUser,
} from '@/mocks/data'

const wait = (ms = 300) =>
    new Promise(resolve => setTimeout(resolve, ms))

const mockState = {
    pendingEmail: '',
    verifiedEmail: '',
    recoveryEmail: '',
}

function makeToken() {
    return `mock-token-${Date.now()}`
}

function requireValue(value, message) {
    if (!String(value ?? '').trim()) {
        throw new Error(message)
    }
}

export const mockApi = {
    async login({ email, username, password }) {
        await wait()

        const identifier = email || username

        requireValue(
            identifier,
            'Введите почту или username'
        )

        requireValue(
            password,
            'Введите пароль'
        )

        return {
            token: makeToken(),
            user: {
                ...currentUser,
                email: identifier,
            },
        }
    },

    async sendCode({
                       email,
                       purpose = 'register',
                   }) {
        await wait()

        requireValue(
            email,
            'Введите почту'
        )

        if (purpose === 'recover') {
            mockState.recoveryEmail = email
        } else {
            mockState.pendingEmail = email
        }

        return {
            ok: true,
        }
    },

    async verifyCode({
                         email,
                         code,
                         purpose = 'register',
                     }) {
        await wait()

        if (!/^\d{6}$/.test(String(code ?? ''))) {
            throw new Error(
                'Введите 6-значный код'
            )
        }

        const expectedEmail =
            purpose === 'recover'
                ? mockState.recoveryEmail
                : mockState.pendingEmail

        if (
            email &&
            expectedEmail &&
            email !== expectedEmail
        ) {
            throw new Error(
                'Код относится к другой почте'
            )
        }

        if (purpose === 'recover') {
            mockState.recoveryEmail =
                email || expectedEmail
        } else {
            mockState.verifiedEmail =
                email || expectedEmail
        }

        return {
            ok: true,
        }
    },

    async completeProfile(payload) {
        await wait()

        const email =
            payload.email ||
            mockState.verifiedEmail ||
            mockState.pendingEmail

        requireValue(
            email,
            'Почта не подтверждена'
        )

        requireValue(
            payload.username,
            'Введите username'
        )

        const username = String(payload.username || '').trim()
        const displayName = String(payload.displayName || username).trim()

        if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
            throw new Error(
                'Username: 3-16 символов, только латиница, цифры и _'
            )
        }

        requireValue(
            displayName,
            'Введите отображаемое имя'
        )

        requireValue(
            payload.password,
            'Введите пароль'
        )

        return {
            token: makeToken(),

            user: {
                ...currentUser,
                email,
                name: displayName,
                username,
                status: 'online',
            },
        }
    },

    async resetPassword({
                            email,
                            code,
                            password,
                        }) {
        await wait()

        requireValue(
            email,
            'Введите почту'
        )

        requireValue(
            password,
            'Введите новый пароль'
        )

        if (
            !/^\d{6}$/.test(
                String(code ?? '')
            )
        ) {
            throw new Error(
                'Введите 6-значный код'
            )
        }

        return {
            ok: true,
        }
    },

    async getChannels() {
        await wait()
        return channels
    },

    async getSpaces() {
        await wait()
        return spaces
    },

    async getFriends() {
        await wait()
        return users.slice(0, 4)
    },

    async getMessages(channelId) {
        await wait()

        return (
            messagesStore[channelId] ||
            []
        )
    },

    async sendMessage(
        channelId,
        content
    ) {
        await wait(150)

        const msg = {
            id: `m-${Date.now()}`,
            authorId: 'me',

            time: new Date().toLocaleTimeString(
                'ru-RU',
                {
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ),

            text: content,
            self: true,
            reactions: [],
        }

        if (!messagesStore[channelId]) {
            messagesStore[channelId] = []
        }

        messagesStore[channelId].push(msg)

        return msg
    },
}