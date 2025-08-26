import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import configuration from '../config/configuration';

@Injectable()
export class SoftAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const payload: { userId: string } = await this.jwtService.verifyAsync(
          token,
          { secret: configuration().jwt.secret },
        );

        request['userId'] = payload.userId;
      } catch {
        request['userId'] = null; // invalid token
      }
    } else {
      request['userId'] = null; // no token
    }
    return true; // always allow
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}