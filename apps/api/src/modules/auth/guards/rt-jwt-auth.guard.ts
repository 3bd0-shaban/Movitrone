import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class RTJwtAuthGuard extends AuthGuard(AuthStrategy.Refresh_JWT) {}
