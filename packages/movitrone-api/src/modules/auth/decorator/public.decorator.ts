import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../auth.constant';

/**
 * Add this decorator when the interface does not need to check if the user is logged in
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
