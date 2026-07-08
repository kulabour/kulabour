import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getConversations(@Request() req: any) {
    return this.chatService.getUserConversations(req.user.sub);
  }

  @Get(':id/messages')
  async getMessages(
    @Request() req: any,
    @Param('id') bookingId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    return this.chatService.getMessages(req.user.sub, bookingId, parseInt(page, 10), parseInt(limit, 10));
  }
}
