import { Controller, Scope } from '@nestjs/common';

@Controller({
  path: 'menu',
  scope: Scope.REQUEST,
})
export default class MenuController {}
