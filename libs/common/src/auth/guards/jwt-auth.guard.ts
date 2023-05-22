import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const accessToken = this.getAuthentication(context);
        return this.authClient
            .send('validate_user', {
                accessToken,
            })
            .pipe(
                tap((res) => {
                    this.addUser(res, context);
                }),
                catchError(() => {
                    throw new UnauthorizedException();
                }),
            );
    }

    private getAuthentication(context: ExecutionContext) {
        let accessToken: string;
        if (context.getType() === 'rpc') {
            accessToken = context.switchToRpc().getData().Authentication;
        } else if (context.getType() === 'http') {
            accessToken = context.switchToHttp().getRequest()
                .cookies?.accessToken;
            console.log(accessToken);
        }
        if (!accessToken) {
            throw new UnauthorizedException(
                'No value was provided for Authentication',
            );
        }
        return accessToken;
    }

    private addUser(user: any, context: ExecutionContext) {
        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }
}