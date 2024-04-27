import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../user/user.service';

@ApiTags('Website Auth - website registeration')
@Controller('auth-admin')
export class AdminAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
}
