import { PartialType } from '@nestjs/mapped-types';
import { createNotificationDTO } from './create-notif.dto';
import { IsBoolean, IsNotEmpty, isNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDTO extends PartialType(createNotificationDTO) {
  @ApiProperty()
  @IsOptional()
  userId?: number | undefined;

  @ApiProperty()
  @IsOptional()
  message?: string | undefined;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isRead?: boolean | undefined;
}
