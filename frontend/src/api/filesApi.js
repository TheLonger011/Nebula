import { USE_MOCK_API, delay, http, MOCK_DELAY } from './config';

export const filesApi = {
    async uploadFile(file) {
        if (USE_MOCK_API) {
            await delay(MOCK_DELAY * 3);
            return {
                id: `file-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: '#',
                status: 'uploaded',
            };
        }
        const formData = new FormData();
        formData.append('file', file);
        return http('/files', { method: 'POST', body: formData, headers: {} });
    },
};