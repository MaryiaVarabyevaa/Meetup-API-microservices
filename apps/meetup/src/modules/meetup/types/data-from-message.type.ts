import {CreateMeetup} from "./create-meetup.type";
import {UpdateMeetup} from "./update-meetup.type";
import {IdObject} from "./id-object.type";

export type Data = CreateMeetup | UpdateMeetup | IdObject;