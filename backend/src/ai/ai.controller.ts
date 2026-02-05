import { Body, Controller, Post, Req, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { GenerateEmailDto, AnalyzeEmailDto } from './dto';

interface RequestWithUser extends Request {
  user?: { userId: number; email: string };
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  async generate(@Req() req: RequestWithUser, @Body() body: GenerateEmailDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();
    
    try {
        return await this.aiService.generateEmail(userId, body.prompt);
    } catch (e) {
        if (e instanceof Error && e.message === 'Need active subscription') {
            throw new ForbiddenException('需要订阅才能使用 AI 功能');
        }
        throw e;
    }
  }

  @Post('analyze')
  @UseGuards(AuthGuard('jwt'))
  async analyze(@Req() req: RequestWithUser, @Body() body: AnalyzeEmailDto) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException();

    try {
        return await this.aiService.analyzeEmail(userId, body.content);
    } catch (e) {
        if (e instanceof Error && e.message === 'Need active subscription') {
            throw new ForbiddenException('需要订阅才能使用 AI 功能');
        }
        throw e;
    }
  }
}
