import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(roomId: string, client: Socket): {
        event: string;
        data: string;
    };
    handleMessage(payload: {
        roomId: string;
        message: string;
        senderId: string;
    }): {
        roomId: string;
        message: string;
        senderId: string;
    };
    handleTyping(payload: {
        roomId: string;
        isTyping: boolean;
        senderId: string;
    }): void;
}
