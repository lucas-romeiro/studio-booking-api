import { UserRole } from '@/domain/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Jhon Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'jhon_doe@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.MUSICIAN })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
