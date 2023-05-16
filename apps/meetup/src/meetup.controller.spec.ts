import { Test, TestingModule } from '@nestjs/testing';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';

describe('MeetupController', () => {
  let meetupController: MeetupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MeetupController],
      providers: [MeetupService],
    }).compile();

    meetupController = app.get<MeetupController>(MeetupController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(meetupController.getHello()).toBe('Hello World!');
    });
  });
});
