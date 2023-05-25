import { CreateMeetupData } from './index';

export interface UpdateMeetupData extends CreateMeetupData {
  userId: number;
}
