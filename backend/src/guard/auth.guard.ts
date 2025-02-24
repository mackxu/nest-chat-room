import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ALLOW_NO_LOGIN } from 'src/common/custom.decorator';
import { Request } from 'express';

type JwtPayload = {
  username: string;
  uid: number;
};

declare module 'express' {
  interface Request {
    user: JwtPayload;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowNoLogin = this.reflector.getAllAndOverride(ALLOW_NO_LOGIN, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowNoLogin) return true;
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('未登录');
    }
    const [, token] = authHeader.split(' ');
    try {
      const user = this.jwtService.verify<JwtPayload>(token);
      request.user = user;
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('登录已过期');
    }
  }
}
