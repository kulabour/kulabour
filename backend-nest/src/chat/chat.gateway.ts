import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @MessageBody() roomId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(roomId);
        console.log(`Client ${client.id} joined room ${roomId}`);
        return { event: 'joined_room', data: roomId };
    }

    @SubscribeMessage('send_message')
    handleMessage(@MessageBody() payload: { roomId: string; message: string; senderId: string }) {
        // In a real app, save to DB here
        console.log(`Message in ${payload.roomId}: ${payload.message}`);
        this.server.to(payload.roomId).emit('receive_message', payload);
        return payload;
    }

    @SubscribeMessage('typing')
    handleTyping(@MessageBody() payload: { roomId: string; isTyping: boolean; senderId: string }) {
        this.server.to(payload.roomId).emit('user_typing', payload);
    }
}
