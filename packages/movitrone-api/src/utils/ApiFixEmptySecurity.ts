import { OpenAPIObject } from '@nestjs/swagger';

export function ApiFixEmptySecurity(apiObject: OpenAPIObject): void {
  Object.entries(apiObject.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (Array.isArray(operation.security)) {
        // Check if any security definition in the array matches the condition
        const hasPublicSecurity = operation.security.some((security: any) =>
          Object.keys(security).includes('public'),
        );

        if (hasPublicSecurity) {
          // Remove security for this endpoint
          operation.security = [];
        }
      }
    });
  });
}
