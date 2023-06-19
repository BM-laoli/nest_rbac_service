import { Controller, Scope } from '@nestjs/common';

@Controller({
  path: 'acb',
  scope: Scope.REQUEST,
})
export default class ACBController {}
