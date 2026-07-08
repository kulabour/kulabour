import { io, Socket } from 'socket.io-client';
import { config } from '../config';

const SOCKET_URL = config.SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
        // Register the user ID with the socket gateway
        this.socket?.emit('register', { userId });
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
