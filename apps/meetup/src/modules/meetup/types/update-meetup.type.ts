import { CreateMeetup } from './create-meetup.type';

export interface UpdateMeetup extends CreateMeetup {
  id: number;
  // userId: number;
}
