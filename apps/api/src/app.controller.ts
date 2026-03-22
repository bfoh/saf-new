import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Temporary auth-check endpoint — confirms JWT validation works
  @Get('auth-check')
  authCheck(@Request() req: any) {
    const user = req.user;
    return { ok: true, userId: user?.id, role: user?.role, email: user?.email };
  }

  @Public()
  @Get('health')
  health() {
    const secret = process.env.SUPABASE_JWT_SECRET;
    return {
      status: 'ok',
      env: process.env.NODE_ENV || 'not set',
      jwtSecretLoaded: !!secret,
      jwtSecretLength: secret?.length ?? 0,
    };
  }
}
