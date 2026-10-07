export const initialState = {
    spaces: [],
    activeSpaceId: 's1',
    channels: [],
    activeChannelId: 'c2',
    messages: [],
    loading: true,
    error: null,
};

export function appReducer(state, action) {
    switch (action.type) {
        case 'SET_SPACES':
            return { ...state, spaces: action.payload, loading: false };

        case 'SET_ACTIVE_SPACE':
            return { ...state, activeSpaceId: action.payload };

        case 'SET_CHANNELS':
            return { ...state, channels: action.payload };

        case 'SET_ACTIVE_CHANNEL':
            return { ...state, activeChannelId: action.payload };

        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };

        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };

        case 'UPDATE_MESSAGE':
            return {
                ...state,
                messages: state.messages.map((m) =>
                    m.clientId === action.payload.clientId ? { ...m, ...action.payload } : m
                ),
            };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
}