import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, headers } = ctx.getContext();
    // console.log(req.headers.authorization);
    return headers ? headers : req;
  }
}
