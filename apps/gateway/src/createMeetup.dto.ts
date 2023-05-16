import {IsArray, IsNotEmpty, IsString} from "class-validator";

export class CreateMeetupDto {
    @IsNotEmpty()
    @IsString()
    readonly topic: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly time: string;

    @IsNotEmpty()
    @IsString()
    readonly date: string;

    @IsNotEmpty()
    @IsString()
    readonly place: string;

    @IsNotEmpty()
    @IsArray()
    readonly tags: string[];
}