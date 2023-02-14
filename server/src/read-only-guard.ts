import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ReadOnlyGuard implements CanActivate {
  public constructor(@Inject() private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (request.method === 'GET') {
      return true;
    }

    return !this.configService.getOrThrow<boolean>('READ_ONLY_ACCESS');
  }
}
