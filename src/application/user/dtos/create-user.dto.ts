import { UserRole } from '@/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'john_doe@email.com ' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password1!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.MUSICIAN })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
