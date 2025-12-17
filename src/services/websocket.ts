import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('admin_token');
    
    this.socket = io(API_BASE_URL, {
      auth: {
        token: token || undefined
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');
    });

    this.socket.on('cart.location.updated', (data) => {
      this.emit('cartLocationUpdated', data);
    });

    this.socket.on('alert.created', (data) => {
      this.emit('alertCreated', data);
    });

    this.socket.on('alert.resolved', (data) => {
      this.emit('alertResolved', data);
    });

    this.socket.on('cart.assignment.changed', (data) => {
      this.emit('cartAssignmentChanged', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const webSocketService = new WebSocketService();