export { Location } from '../location.type';

export interface Meetup {
  id: number;
  topic: string;
  description: string;
  time: string;
  date: string;
  country: string;
  city: string;
  street: string;
  houseNumber: string;
  tags: string[];
  location: Location;
}
