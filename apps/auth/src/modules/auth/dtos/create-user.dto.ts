import {Provider} from "@prisma/client/auth";

export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password?: string;
  readonly provider?: Provider;
}
