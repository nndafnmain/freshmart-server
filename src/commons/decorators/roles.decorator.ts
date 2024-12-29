import { SetMetadata } from "@nestjs/common";
import type { Roles } from "@prisma/client";

export const ROLES_KEY = "roles";
export const Rolesx = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
