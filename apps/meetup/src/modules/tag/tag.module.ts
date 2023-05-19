import {Module} from '@nestjs/common';
import {MeetupPrismaModule} from "@app/common";
import {TagService} from './tag.service';

@Module({
  imports: [MeetupPrismaModule],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
