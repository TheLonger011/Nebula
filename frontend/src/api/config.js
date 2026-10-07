export const USE_MOCK_API = true;
export const API_BASE_URL = 'http://localhost:8080/api';

// Задержка для имитации сети в mock-режиме
export const MOCK_DELAY = 400;

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Общий helper для запросов
export async function http(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
}