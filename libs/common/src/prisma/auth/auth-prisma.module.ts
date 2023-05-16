import {Module} from "@nestjs/common";
import { PrismaClient as AuthPrismaClient} from '@prisma/client/auth';

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