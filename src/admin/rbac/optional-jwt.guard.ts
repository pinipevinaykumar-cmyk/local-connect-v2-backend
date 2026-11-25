import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Populates req.user when a valid token is present, but never rejects. */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}
