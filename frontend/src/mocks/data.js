export const currentUser = {
    id: 'me',
    name: '',
    displayName: '',
    username: '',
    avatar: '',
    email: '',
    status: 'offline',
    bio: '',
    birthDate: null,
    createdAt: null,
}

export const users = []
export const channels = []
export const spaces = []
export const messagesStore = {}
export const friends = []
export const incomingRequests = []
export const outgoingRequests = []
export const directMessages = {}
export const voiceRooms = []
export const notifications = []

export const settingsDefaults = {
    theme: 'dark',
    language: 'ru',
    notifications: {
        desktop: true,
        sounds: true,
        mentions: true,
    },
    privacy: {
        dmFromEveryone: true,
        showOnlineStatus: true,
    },
}