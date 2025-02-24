import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';

export const ALLOW_NO_LOGIN = 'allow_no_login';

export const AllowNoLogin = () => SetMetadata(ALLOW_NO_LOGIN, true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
