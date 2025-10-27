import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      // console.log('from auth guard', request['user']);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractFromHeader(request: Request): string | undefined {
    const [bearer, accessToken] =
      request.headers.authorization?.split(' ') ?? [];
    return bearer === 'Bearer' ? accessToken : undefined;
  }
}

