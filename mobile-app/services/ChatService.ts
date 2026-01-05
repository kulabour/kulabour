import io, { Socket } from 'socket.io-client';

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'system';
}

import { Config } from '../Config';

class ChatService {
    public socket: Socket | null = null;
    private listeners: { [key: string]: Function[] } = {};

    connect(authToken: string) {
        if (this.socket?.connected) return;

        this.socket = io(Config.SOCKET_URL, {
            auth: {
                token: authToken
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('Connected to Chat Server');
            this.emit('connection_status', 'connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Chat Server');
            this.emit('connection_status', 'disconnected');
        });

        this.socket.on('receive_message', (payload: ChatMessage) => {
            this.emit('receive_message', payload);
        });

        this.socket.on('user_typing', (payload: any) => {
            this.emit('user_typing', payload);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinRoom(roomId: string) {
        if (this.socket) {
            this.socket.emit('join_room', roomId);
        }
    }

    sendMessage(roomId: string, message: string, senderId: string) {
        if (this.socket) {
            this.socket.emit('send_message', { roomId, message, senderId });
        }
    }

    sendTyping(roomId: string, isTyping: boolean, senderId: string) {
        if (this.socket) {
            this.socket.emit('typing', { roomId, isTyping, senderId });
        }
    }

    // Simple Event Emitter implementation
    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    private emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

export const chatService = new ChatService();
