import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { HttpException, Logger } from '@nestjs/common';
import { GraphQLRequestContext } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';

const logger = new Logger('GraphQL');

export const LoggingPlugin: ApolloServerPlugin = {
  async requestDidStart(
    context: GraphQLRequestContext<object>,
  ): Promise<GraphQLRequestListener<object>> {
    const start = Date.now();

    return {
      async didResolveOperation(ctx) {
        const operation = ctx.operation?.operation ?? 'unknown';
        const name = ctx.operationName || 'anonymous';
        const variables = JSON.stringify(ctx.request.variables ?? {});

        logger.log(`${operation} ${name} | ${variables}`);
      },

      async didEncounterErrors(ctx) {
        const duration = Date.now() - start;
        const operation = ctx.operation?.operation ?? 'unknown';
        const name = ctx.operationName || 'anonymous';

        for (const error of ctx.errors) {
          const originalError = unwrapResolverError(error);
          let statusCode = 500;
          let message = error.message;

          if (originalError instanceof HttpException) {
            statusCode = originalError.getStatus();
            const response = originalError.getResponse();
            if (typeof response === 'object' && 'message' in response) {
              const msg = (response as Record<string, unknown>).message;
              message = Array.isArray(msg) ? msg.join(', ') : String(msg);
            }
          }

          logger.error(
            `${operation} ${name} - ${statusCode} ${message} + ${duration}ms`,
          );
        }
      },
    };
  },
};
