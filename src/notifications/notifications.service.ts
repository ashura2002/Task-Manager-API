import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createNotificationDTO } from './dto/create-notif.dto';
import { Notification_ } from './entities/notifications.entity';
import { UserService } from 'src/users/users.service';
import { TaskService } from 'src/tasks/tasks.service';

@Injectable()
export class NotificationService {


}
