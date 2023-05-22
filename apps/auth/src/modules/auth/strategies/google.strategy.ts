import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';
import {UserService} from "../../user/user.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
       private readonly configService: ConfigService,
       private readonly userService: UserService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('CALLBACK_URL'),
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
        }
        done(null, user);
    }
}