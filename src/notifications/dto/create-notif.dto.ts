import { IsBoolean, IsInt, IsNotEmpty,  IsOptional,  IsString } from 'class-validator';


export class createNotificationDTO {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  message: string;
}
