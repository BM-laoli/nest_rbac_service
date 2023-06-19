import { Controller, Scope } from '@nestjs/common';

@Controller({
  path: 'role',
  scope: Scope.REQUEST,
})
export default class RoleController {}
