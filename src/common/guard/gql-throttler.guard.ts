import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.req?.res };
  }

  protected async handleRequest(requestProps: ThrottlerRequest) {
    const { context } = requestProps;
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    // Skip throttling if no request context (e.g. in tests or subscriptions)
    if (!ctx.req) {
      return true;
    }

    return super.handleRequest(requestProps);
  }
}
