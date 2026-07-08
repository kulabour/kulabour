import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  // Map to store connected clients: userId -> socketId
  private connectedClients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedClients.set(data.userId, client.id);
    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);
    return { event: 'registered', data: { success: true } };
  }

  emitToUser(userId: string, event: string, payload: any) {
    const socketId = this.connectedClients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
      this.logger.log(`Sent event ${event} to user ${userId}`);
    } else {
      this.logger.warn(`User ${userId} not connected for event ${event}`);
    }
  }

  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
