import { PartialType } from '@nestjs/mapped-types';
import { createNotificationDTO } from './create-notif.dto';
import { IsBoolean, IsNotEmpty, isNotEmpty, IsOptional } from 'class-validator';

export class UpdateNotificationDTO extends PartialType(createNotificationDTO) {
  @IsOptional()
  userId?: number | undefined;

  @IsOptional()
  message?: string | undefined;

  @IsNotEmpty()
  @IsBoolean()
  isRead?: boolean | undefined;
}
