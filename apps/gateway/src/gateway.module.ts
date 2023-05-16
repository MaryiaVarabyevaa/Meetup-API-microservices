import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {PrismaClient} from "@prisma/client";
import {ConfigModule} from "@nestjs/config";
import {RmqModule} from "@app/common";
import {MEETUP_SERVICE} from "./constants";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
          envFilePath: './apps/gateway/.env'
      }),
      RmqModule.register({
          name: MEETUP_SERVICE
      })
  ],
  controllers: [GatewayController],
  providers: [GatewayService, PrismaClient],
})
export class GatewayModule {}
