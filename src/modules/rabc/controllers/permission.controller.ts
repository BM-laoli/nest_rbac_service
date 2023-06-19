import { Controller, Scope } from '@nestjs/common';

@Controller({
  path: 'permission',
  scope: Scope.REQUEST,
})
export default class PermissionController {}
