import {Injectable} from "@nestjs/common";
import {User} from "@prisma/client/auth";
import {Payload} from "../../token/types";


@Injectable()
export class JwtHelper {
    generateJwtPayload(user: User): Payload {
        return {
            sub: user.id,
            email: user.email,
            role: user.role
        }
    }
}