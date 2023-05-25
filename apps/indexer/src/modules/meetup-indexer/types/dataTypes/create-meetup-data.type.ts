export interface CreateMeetupData {
  topic: string;
  description: string;
  time: string;
  date: string;
  country: string;
  city: string;
  street: string;
  houseNumber: string;
  tags: string[];
  latitude: number;
  longitude: number;
}
