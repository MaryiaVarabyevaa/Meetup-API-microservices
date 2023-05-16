import {Module} from "@nestjs/common";
import { AuthPrismaClient } from '../prisma-clients';

@Module({
    providers: [
        {
            provide: 'AUTH_PRISMA',
            useValue: new AuthPrismaClient(),
        },
    ],
    exports: ['AUTH_PRISMA'],
})
export class AuthPrismaModule {}