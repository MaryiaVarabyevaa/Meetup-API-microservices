import { Provider } from '@prisma/client/auth';

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  provider: Provider;
}
