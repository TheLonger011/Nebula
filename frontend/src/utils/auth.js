export const CODE_LENGTH = 6
export const PASSWORD_MIN = 8
export const RESEND_SECONDS = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const USERNAME_RE = /^[A-Za-z0-9_]{3,16}$/

export const isEmail = (value) => EMAIL_RE.test(value)
export const isUsername = (value) => USERNAME_RE.test(value)

export function maskEmail(email) {
    if (!email) return 'почту, указанную при регистрации'

    const at = email.indexOf('@')
    if (at <= 0 || at === email.length - 1) return email

    return `${email.slice(0, 1)}***@${email.slice(at + 1)}`
}

/** Пороги длины пароля для 4 сегментов индикатора. */
export const STRENGTH_STEPS = [1, 4, 8, 12]

export function strengthLabel(password) {
    if (!password) return 'не указана'
    if (password.length < PASSWORD_MIN) return 'слабая'
    if (password.length < 12) return 'хорошая'
    return 'отличная'
}

const MONTH_PREFIXES = [
    'янв', 'фев', 'мар', 'апр', 'ма', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
]

/**
 * День/месяц/год → { value: 'YYYY-MM-DD' | null, error: string }.
 * Все поля пустые — дата необязательна. Месяц: число 1–12 или название.
 */
export function parseBirthDate({ day, month, year }) {
    const d = day.trim()
    const m = month.trim().toLowerCase()
    const y = year.trim()

    if (!d && !m && !y) return { value: null, error: '' }

    const bad = { value: null, error: 'Проверьте дату рождения' }

    if (!/^\d{1,2}$/.test(d) || !/^\d{4}$/.test(y)) return bad

    let monthNum
    if (/^\d{1,2}$/.test(m)) {
        monthNum = Number(m)
    } else if (m.length >= 3) {
        monthNum = MONTH_PREFIXES.findIndex((p) => m.startsWith(p)) + 1
    }
    if (!monthNum || monthNum < 1 || monthNum > 12) return bad

    const date = new Date(Number(y), monthNum - 1, Number(d))
    const valid =
        date.getFullYear() === Number(y) &&
        date.getMonth() === monthNum - 1 &&
        date.getDate() === Number(d)

    if (!valid || Number(y) < 1900 || date > new Date()) return bad

    const pad = (n) => String(n).padStart(2, '0')
    return { value: `${y}-${pad(monthNum)}-${pad(Number(d))}`, error: '' }
}
