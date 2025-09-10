import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'ADMIN') {
        throw new ForbiddenException('Admin access required');
      }

      // Add user info to request
      request.user = payload;
      return true;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Invalid token or insufficient permissions');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
