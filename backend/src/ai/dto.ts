import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateEmailDto {
  @ApiProperty({ description: '邮件生成提示', example: '写一封给客户的商务邮件' })
  @IsString({ message: '提示必须是字符串' })
  @IsNotEmpty({ message: '提示不能为空' })
  @MaxLength(1000, { message: '提示长度不能超过1000个字符' })
  prompt!: string;
}

export class AnalyzeEmailDto {
  @ApiProperty({ description: '邮件内容', example: '尊敬的先生...' })
  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  @MaxLength(5000, { message: '内容长度不能超过5000个字符' })
  content!: string;
}