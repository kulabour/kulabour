import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

const getSocketURL = () => {
    if (process.env.EXPO_PUBLIC_SOCKET_URL) {
        return process.env.EXPO_PUBLIC_SOCKET_URL;
    }

    // Android Emulator needs 10.0.2.2
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000';
    }

    // iOS Simulator and Web
    return 'http://localhost:5000';
};

class SocketClient {
    private socket: Socket | null = null;

    async connect() {
        if (this.socket?.connected) {
            console.log('✅ Socket already connected');
            return this.socket;
        }

        let token = null;
        if (Platform.OS === 'web') {
            token = localStorage.getItem(TOKEN_KEY);
        } else {
            token = await SecureStore.getItemAsync(TOKEN_KEY);
        }

        if (!token) {
            console.warn('⚠️ No token found, skipping socket connection');
            return null;
        }

        const url = getSocketURL();
        this.socket = io(url, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            auth: {
                token,
            },
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔴 Socket connection error:', error.message);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('🔌 Socket disconnected');
        }
    }

    joinBooking(bookingId: string) {
        if (this.socket) {
            this.socket.emit('join_booking', bookingId);
            console.log(`📍 Joined booking room: ${bookingId}`);
        }
    }

    leaveBooking(bookingId: string) {
        if (this.socket) {
            this.socket.emit('leave_booking', bookingId);
            console.log(`📤 Left booking room: ${bookingId}`);
        }
    }

    onBookingStatusChanged(callback: (data: unknown) => void) {
        if (this.socket) {
            this.socket.on('booking:status_changed', callback);
            return () => this.socket?.off('booking:status_changed', callback);
        }
        return () => { };
    }

    onWorkerLocationUpdate(callback: (location: unknown) => void) {
        if (this.socket) {
            this.socket.on('worker:location_update', callback);
            return () => this.socket?.off('worker:location_update', callback);
        }
        return () => { };
    }

    onWorkerAssigned(callback: (worker: unknown) => void) {
        if (this.socket) {
            this.socket.on('booking:assigned', callback);
            return () => this.socket?.off('booking:assigned', callback);
        }
        return () => { };
    }

    getSocket() {
        return this.socket;
    }
}

const socketClient = new SocketClient();
export default socketClient;
