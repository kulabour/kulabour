import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { UpdateNotificationPrefsDto, RegisterFcmTokenDto } from './dto/notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationService.getUserNotifications(
      req.user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationService.getUnreadCount(req.user.sub);
    return { unreadCount: count };
  }

  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    await this.notificationService.markAsRead(req.user.sub, id);
    return { success: true };
  }

  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.notificationService.getPreferences(req.user.sub);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() dto: UpdateNotificationPrefsDto,
  ) {
    return this.notificationService.updatePreferences(req.user.sub, dto);
  }

  @Post('fcm-token')
  async registerFcmToken(
    @Request() req: any,
    @Body() dto: RegisterFcmTokenDto,
  ) {
    return this.notificationService.registerFcmToken(req.user.sub, dto.fcmToken);
  }
}
