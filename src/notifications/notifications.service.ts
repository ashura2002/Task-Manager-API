import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification_ } from './entities/notifications.entity';
import { UserService } from 'src/users/users.service';
import { createNotificationDTO } from './dto/create-notif.dto';
import { UpdateNotificationDTO } from './dto/update-notif.dto';

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

  async deleteOwnNotification(id: number, userId: number): Promise<void> {
    const notification = await this.notificationRepo.findOne({
      where: { id: id },
      relations: ['recipient'],
    });
    if (!notification) throw new NotFoundException('Notification not found!');

    // check if the recipient id is equal to the user id login
    if (notification.recipient.id !== userId)
      throw new UnauthorizedException(
        'You can only delete your own notification.',
      );
    await this.notificationRepo.remove(notification);
  }

  async markAsReadNotification(
    id: number,
    userId: number,
    updateNotifReadDTO: UpdateNotificationDTO,
  ): Promise<Notification_> {
    const notification = await this.notificationRepo.findOne({
      where: { id },
      relations: ['recipient'],
    });

    if (!notification) throw new NotFoundException('Notification not found');

    if (notification.recipient.id !== userId)
      throw new UnauthorizedException(
        'You are not allowed to mark as read this notification',
      );

    Object.assign(notification, updateNotifReadDTO);
    return await this.notificationRepo.save(notification);
  }
}
