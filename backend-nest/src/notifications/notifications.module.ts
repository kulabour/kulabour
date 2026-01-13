import { Module, Global } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { UsersModule } from '../users/users.module';

@Global() // Make available everywhere
@Module({
    imports: [UsersModule],
    providers: [PushNotificationService],
    exports: [PushNotificationService],
})
export class NotificationsModule { }
