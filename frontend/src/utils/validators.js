export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isUsername = (v) => /^[a-zA-Z0-9_]{3,16}$/.test(v);

export const passwordStrength = (v) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return score; // 0..4
};

export const strengthLabel = (score) => {
    switch (score) {
        case 0: case 1: return 'слабая';
        case 2: return 'средняя';
        case 3: return 'хорошая';
        case 4: return 'надёжная';
        default: return '';
    }
};