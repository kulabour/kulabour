import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Can add custom logic here before checking JWT
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        // Check if token is valid and user exists
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        // Check for admin role
        if (user.role !== 'admin') {
            throw new UnauthorizedException('Admin privileges required');
        }

        return user;
    }
}
