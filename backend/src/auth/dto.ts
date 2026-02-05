import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: '用户邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @MaxLength(100, { message: '邮箱长度不能超过100个字符' })
  email!: string;

  @ApiProperty({ description: '用户密码', example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: '密码长度至少为8个字符' })
  @MaxLength(32, { message: '密码长度不能超过32个字符' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '密码必须包含大小写字母、数字和特殊字符',
  })
  password!: string;
}

export class LoginDto {
  @ApiProperty({ description: '用户邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({ description: '用户密码', example: 'Password123!' })
  @IsString()
  @MinLength(6, { message: '密码长度至少为6个字符' })
  password!: string;
}