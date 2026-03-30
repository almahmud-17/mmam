import { ROLES } from "./auth";

/** Roles that may create/update notices and gallery media */
export const CONTENT_EDITOR_ROLES = [ROLES.ADMIN, ROLES.TEACHER] as const;
