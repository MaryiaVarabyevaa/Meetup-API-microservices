import { Module } from '@nestjs/common';
import {TokenService} from "./token.service";
import {AuthPrismaClient} from "@app/common";

@Module({
    imports: [AuthPrismaClient],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {}
