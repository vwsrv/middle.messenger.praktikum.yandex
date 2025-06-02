type Handler = (...args: any[]) => void;

class EventBus {
    private listeners: Record<string, Handler[]>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Handler): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event: string, callback: Handler): void {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit(event: string, ...args: any[]): void {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(listener => {
            listener(...args);
        });
    }
}

export default EventBus;
