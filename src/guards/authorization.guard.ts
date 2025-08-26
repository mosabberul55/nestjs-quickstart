import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { PermissionDto } from '../role/dto/create-role.dto';
import { AuthService } from '../auth/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  // private readonly logger = new Logger(AuthorizationGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ userId?: string }>();
    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }

    const profileCacheKey = `user-profile:${userId}`;
    let user = await this.cacheManager.get(profileCacheKey);

    if (!user) {
      user = await this.authService.getProfile(userId);
      await this.cacheManager.set(profileCacheKey, user, 60 * 60 * 100); // cache for 1 hour
    }
    // this.logger.warn(user.email);
    if ((user as any).isSuperAdmin) {
      return true;
    }

    const routePermissions: PermissionDto[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!routePermissions || routePermissions.length === 0) {
      return true; // No permissions required
    }
    try {
      let userPermissions = await this.cacheManager.get(
        `user-permissions:${userId}`,
      );
      if (!userPermissions) {
        userPermissions = await this.authService.getUserPermissions(userId);
        await this.cacheManager.set(
          `user-permissions:${userId}`,
          userPermissions,
          60 * 60 * 100,
        ); // cache for 1 hour
      }
      // this.logger.log(userPermissions);

      for (const routePermission of routePermissions) {
        const userPermission = (userPermissions as any).find(
          (perm) => perm.resource === routePermission.resource,
        );

        if (!userPermission) throw new ForbiddenException();

        const allActionsAvailable = routePermission.actions.every(
          (requiredAction) => userPermission.actions.includes(requiredAction),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch (e) {
      throw new ForbiddenException();
    }
    return true;
  }
}
