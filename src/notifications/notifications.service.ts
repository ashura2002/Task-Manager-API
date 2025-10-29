import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification_ } from './entities/notifications.entity';
import { UserService } from 'src/users/users.service';
import { createNotificationDTO } from './dto/create-notif.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification_)
    private readonly notificationRepo: Repository<Notification_>,
    private readonly userService: UserService,
  ) {}

  async getOwnNotification(userId: number): Promise<Notification_[]> {
    const userNotifications = await this.notificationRepo.find({
      where: { recipient: { id: userId } },
    });
    console.log(userId)
    return userNotifications;
  }

  async createUserNotification(
    notificationDTO: createNotificationDTO,
  ): Promise<Notification_> {
    const { userId, message } = notificationDTO;
    const user = await this.userService.findById(userId);
    const userNotification = this.notificationRepo.create({
      recipient: user,
      message: message,
    });
    return this.notificationRepo.save(userNotification);
  }
}
