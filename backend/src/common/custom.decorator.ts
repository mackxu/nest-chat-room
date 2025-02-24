import { SetMetadata } from '@nestjs/common';

export const ALLOW_NO_LOGIN = 'allow_no_login';

export const AllowNoLogin = () => SetMetadata(ALLOW_NO_LOGIN, true);
