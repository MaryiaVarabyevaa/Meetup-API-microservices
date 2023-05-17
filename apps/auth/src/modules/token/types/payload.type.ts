import { UserRole } from '@prisma/client/auth';

export interface Payload {
  email: string;
  sub: number;
  role: string;
}
