import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'connected', // Có thể kiểm tra kết nối database thực tế
        redis: 'connected', // Có thể kiểm tra kết nối Redis thực tế
      },
    };
  }
}
