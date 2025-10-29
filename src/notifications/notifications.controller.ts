import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { NotificationService } from './notifications.service';
import { createNotificationDTO } from './dto/create-notif.dto';
import { Notification_ } from './entities/notifications.entity';

@Controller('notifications')
@UseGuards(AuthGuard, RoleGuard)
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Get('me')
  async getOwnNotification(@Req() req): Promise<Notification_[]> {
    const { userId } = req.user;
    return await this.notifService.getOwnNotification(userId);
  }

  @Post()
  async createUserNotification(
    @Body() createNotificationDTO: createNotificationDTO,
  ): Promise<Notification_> {
    return this.notifService.createUserNotification(createNotificationDTO);
  }
}
