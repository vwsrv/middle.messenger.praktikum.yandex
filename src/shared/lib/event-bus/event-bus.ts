import { THandler } from '@/shared/lib/event-bus/types/event-bus.type.ts';

class EventBus {
  private listeners: Record<string, THandler[]>;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: THandler): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: THandler): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
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
