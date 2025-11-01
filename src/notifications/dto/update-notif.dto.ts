import { PartialType } from '@nestjs/mapped-types';
import { createNotificationDTO } from './create-notif.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDTO extends PartialType(createNotificationDTO) {
 
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isRead?: boolean | undefined;
}
