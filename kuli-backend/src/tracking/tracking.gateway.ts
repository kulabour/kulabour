import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AdaptiveTrackingService, WorkerState, LocationUpdate } from './adaptive-tracking.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, { role: string; userId: string; city: string }>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly trackingService: AdaptiveTrackingService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      const city = client.handshake.query?.city as string || 'ahmedabad';
      if (!token) throw new Error('Missing token');

      const secret = this.configService.get<string>('JWT_ACCESS_SECRET', 'kuli-access-secret-dev');
      const payload = this.jwtService.verify(token, { secret });
      
      this.connectedClients.set(client.id, { role: payload.role, userId: payload.sub, city });

      if (payload.role === 'WORKER') {
        client.join(`worker:${payload.sub}`);
      } else if (payload.role === 'CUSTOMER') {
        client.join(`customer:${payload.sub}`);
      }
      
      console.log(`🔌 Client connected: ${client.id} (${payload.role}) in ${city}`);
    } catch (err) {
      console.log(`❌ Connection rejected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const info = this.connectedClients.get(client.id);
    if (info && info.role === 'WORKER') {
      // Worker disconnected. We might set them offline here if needed.
    }
    this.connectedClients.delete(client.id);
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('location_update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lng: number; accuracy: number; heading: number; speed: number; state: WorkerState; bookingId?: string },
  ) {
    const info = this.connectedClients.get(client.id);
    if (!info || info.role !== 'WORKER') return;

    const update: LocationUpdate = {
      lat: data.lat,
      lng: data.lng,
      accuracy: data.accuracy || 10,
      heading: data.heading || 0,
      speed: data.speed || 0,
      timestamp: new Date().toISOString(),
    };

    const { nextUpdateIn } = await this.trackingService.updateLocation(
      info.userId,
      info.city,
      data.state || 'ONLINE_IDLE',
      update,
    );

    client.emit('location_ack', { nextUpdateIn });

    if (data.bookingId) {
      this.server.to(`booking:${data.bookingId}`).emit('location_update', {
        lat: data.lat,
        lng: data.lng,
        heading: data.heading,
        timestamp: Date.now(),
      });
    }
  }

  @SubscribeMessage('watch_booking')
  handleWatchBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string },
  ) {
    client.join(`booking:${data.bookingId}`);
    console.log(`👀 Client ${client.id} watching booking ${data.bookingId}`);
  }
}
