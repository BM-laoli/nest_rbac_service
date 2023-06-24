import { SetMetadata } from '@nestjs/common';

// 我们设定 以 name 为 唯一值
export enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Guset = 'guest',
}

export const ROLES_KEY = 'ROLES';

// 装饰器Roles SetMetadata将装饰器的值缓存
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
