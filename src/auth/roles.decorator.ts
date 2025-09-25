import { SetMetadata } from '@nestjs/common';
import { GENDER } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GENDER[]) => SetMetadata(ROLES_KEY, roles);
