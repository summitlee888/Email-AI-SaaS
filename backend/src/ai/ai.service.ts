import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async generateEmail(userId: number, prompt: string) {
    // 1. Check if user has active subscription
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub || sub.status !== 'active') {
        // Check if expired
        if (sub && sub.endDate < new Date()) {
             throw new Error('Need active subscription');
        }
        if (!sub || sub.status !== 'active') {
             throw new Error('Need active subscription');
        }
    }

    // 2. Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    
    if (!apiKey) {
      throw new Error('AI service not configured');
    }

    let result;
    try {
      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a professional email assistant. Generate well-structured, professional emails based on user prompts. Return only the email content without explanations.'
            },
            {
              role: 'user',
              content: `Generate a professional email for: ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      result = response.data.choices[0]?.message?.content || 'Failed to generate email';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to generate email content');
    }

    // 3. Save task
    await this.prisma.emailTask.create({
      data: {
        userId,
        type: 'generation',
        content: prompt,
        result,
      },
    });

    return { result };
  }

  async analyzeEmail(userId: number, content: string) {
     const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub || sub.status !== 'active') {
        if (sub && sub.endDate < new Date()) {
             throw new Error('Need active subscription');
        }
        if (!sub || sub.status !== 'active') {
             throw new Error('Need active subscription');
        }
    }

    // Call DeepSeek API for analysis
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    
    if (!apiKey) {
      throw new Error('AI service not configured');
    }

    let result;
    try {
      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a professional email analyst. Analyze the given email content and provide insights on tone, sentiment, key points, and suggestions for improvement. Return a concise analysis summary.'
            },
            {
              role: 'user',
              content: `Analyze this email and provide insights:\n\n${content}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      result = response.data.choices[0]?.message?.content || 'Failed to analyze email';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to analyze email content');
    }

    await this.prisma.emailTask.create({
      data: {
        userId,
        type: 'analysis',
        content,
        result,
      },
    });

    return { result };
  }
}
