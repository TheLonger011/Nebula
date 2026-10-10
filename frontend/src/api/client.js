/*
 * Базовый HTTP-клиент Nebula.
 *
 * - Префикс адреса берётся из VITE_API_URL (без хардкода).
 * - Authorization: Bearer <token> добавляется из localStorage (nebula_token).
 * - Ошибки сервера (текст или JSON { error: "..." }) приводятся к одному
 *   виду — ApiError { message, status, code, data }.
 * - Переключение mock/real — переменная VITE_USE_MOCK (см. src/api/index.js).
 */

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

const TOKEN_KEY = 'nebula_token'
const USER_KEY = 'nebula_user'
const PENDING_KEY = 'nebula_pending_registration'

/** Событие: сервер ответил 401 на запрос с токеном (токен протух/отозван). */
export const UNAUTHORIZED_EVENT = 'nebula:unauthorized'

export class ApiError extends Error {
    constructor(message, { status = 0, code = '', data = null, cause } = {}) {
        super(message, cause ? { cause } : undefined)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.data = data
    }
}

/* ---------- безопасная работа со storage ---------- */

function read(storage, key) {
    try {
        return storage.getItem(key)
    } catch (err) {
        console.warn(`[storage] чтение "${key}" недоступно`, err)
        return null
    }
}

function write(storage, key, value) {
    try {
        storage.setItem(key, value)
    } catch (err) {
        console.warn(`[storage] запись "${key}" недоступна`, err)
    }
}

function remove(storage, key) {
    try {
        storage.removeItem(key)
    } catch (err) {
        console.warn(`[storage] удаление "${key}" недоступно`, err)
    }
}

/** JWT и пользователь (localStorage: nebula_token / nebula_user). */
export const session = {
    getToken: () => read(localStorage, TOKEN_KEY),

    getUser() {
        const raw = read(localStorage, USER_KEY)
        if (!raw) return null
        try {
            return JSON.parse(raw)
        } catch (err) {
            console.warn('[session] nebula_user повреждён, сессия сброшена', err)
            session.clear()
            return null
        }
    },

    save(token, user) {
        write(localStorage, TOKEN_KEY, token)
        write(localStorage, USER_KEY, JSON.stringify(user))
    },

    clear() {
        remove(localStorage, TOKEN_KEY)
        remove(localStorage, USER_KEY)
    },
}

/**
 * Незавершённая регистрация: { email, ticket? }.
 * Живёт в sessionStorage (закрыл вкладку — начал заново).
 */
export const pendingRegistration = {
    get() {
        const raw = read(sessionStorage, PENDING_KEY)
        if (!raw) return null
        try {
            return JSON.parse(raw)
        } catch (err) {
            console.warn('[session] повреждены данные регистрации', err)
            remove(sessionStorage, PENDING_KEY)
            return null
        }
    },

    set: (value) => write(sessionStorage, PENDING_KEY, JSON.stringify(value)),

    clear: () => remove(sessionStorage, PENDING_KEY),
}

/* ---------- запросы ---------- */

async function parseBody(res) {
    if (res.status === 204) return null

    const text = await res.text()
    if (!text) return null

    try {
        return JSON.parse(text)
    } catch (err) {
        // Не JSON — считаем, что сервер вернул текст ошибки/ответа как есть.
        console.debug('[api] ответ не является JSON', err)
        return text
    }
}

function extractMessage(data, status) {
    if (typeof data === 'string' && data.trim()) return data.trim()
    if (data && typeof data === 'object') {
        if (typeof data.error === 'string') return data.error
        if (typeof data.error?.message === 'string') return data.error.message
        if (typeof data.message === 'string') return data.message
    }
    if (status >= 500) return 'Ошибка сервера. Попробуйте позже'
    return `Ошибка запроса (${status})`
}

function extractCode(data) {
    if (data && typeof data === 'object') {
        if (typeof data.code === 'string') return data.code
        if (typeof data.error?.code === 'string') return data.error.code
    }
    return ''
}

/**
 * @param {string} path  путь после VITE_API_URL, например '/auth/login'
 * @param {object} options  fetch-опции + skipAuth (не слать Authorization)
 */
async function request(path, { skipAuth = false, headers, ...options } = {}) {
    const token = skipAuth ? null : session.getToken()

    let res
    try {
        res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
        })
    } catch (cause) {
        throw new ApiError('Не удаётся связаться с сервером', {
            code: 'NETWORK_ERROR',
            cause,
        })
    }

    const data = await parseBody(res)

    if (!res.ok) {
        if (res.status === 401 && token) {
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }

        throw new ApiError(extractMessage(data, res.status), {
            status: res.status,
            code: extractCode(data),
            data: data && typeof data === 'object' ? data : null,
        })
    }

    return data
}

export const http = {
    get:    (path, opts)       => request(path, opts),
    post:   (path, body, opts) => request(path, { ...opts, method: 'POST',   body: JSON.stringify(body ?? {}) }),
    patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH',  body: JSON.stringify(body ?? {}) }),
    delete: (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
}
