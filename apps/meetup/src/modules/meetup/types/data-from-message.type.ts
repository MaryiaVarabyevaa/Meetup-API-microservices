import {CreateMeetup} from "./create-meetup.type";
import {UpdateMeetup} from "./update-meetup.type";

export type Data = CreateMeetup | UpdateMeetup | { id: number };