let socket = null;
const listeners = new Map();

export const websocketService = {
    connect(url) {
        if (socket) return socket;

        // Когда backend будет готов — раскомментировать:
        // socket = new WebSocket(url);
        // socket.onmessage = (e) => {
        //   const msg = JSON.parse(e.data);
        //   (listeners.get(msg.type) || []).forEach((cb) => cb(msg.payload));
        // };
        // socket.onclose = () => { socket = null; };

        // Пока — заглушка
        console.info('[WS] mock mode, connect skipped');
        return null;
    },

    on(type, callback) {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(callback);
        return () => {
            const arr = listeners.get(type) || [];
            listeners.set(type, arr.filter((cb) => cb !== callback));
        };
    },

    send(type, payload) {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type, payload }));
        } else {
            console.info('[WS] mock send:', { type, payload });
        }
    },

    disconnect() {
        socket?.close();
        socket = null;
    },
};