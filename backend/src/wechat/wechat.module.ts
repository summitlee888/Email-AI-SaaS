import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';

@Module({
  controllers: [WechatController],
})
export class WechatModule {}
