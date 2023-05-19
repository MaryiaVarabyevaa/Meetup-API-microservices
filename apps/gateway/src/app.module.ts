import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
import { AuthPrismaModule, MeetupPrismaModule, RmqModule } from '@app/common';
import { MEETUP_SERVICE } from './constants';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {GATEWAY_SERVICE} from "../../meetup/src/constants/services";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    RmqModule.register({
      name: MEETUP_SERVICE,
      queue: process.env.RABBIT_MQ_MEETUP_QUEUE
    }),
    AuthPrismaModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, PrismaClient],
})
export class GatewayModule {}
