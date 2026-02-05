import { Body, Controller, Post } from '@nestjs/common';

// 微信支付通知 & 下单示例（仅结构示例，未做真实签名校验）

@Controller('wechat')
export class WechatController {
  // 创建微信支付订单（示例）
  @Post('create-order')
  createOrder(@Body() body: { description: string; amount: number }) {
    return {
      description: body.description,
      amount: body.amount,
      payMethod: 'wechat',
      codeUrl: 'weixin://wxpay/bizpayurl?pr=example',
    };
  }

  // 微信支付回调通知（示例）
  @Post('notify')
  handleNotify() {
    // 这里应该解析微信回调报文、验证签名，并更新订单/订阅状态
    return 'success';
  }
}

