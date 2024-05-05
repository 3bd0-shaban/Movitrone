import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class RTJwtUserGuard extends AuthGuard(
  AuthStrategy.REFRESH_JWT_WEBSITE,
) {}

@Injectable()
export class RTJwtAdminGuard extends AuthGuard(
  AuthStrategy.REFRESH_JWT_Dashboard,
) {}
