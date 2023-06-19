import { Controller, Scope } from '@nestjs/common';
import UserService from '../services/user.service';

@Controller({
  path: 'user',
  scope: Scope.REQUEST,
})
export default class UserController {
  constructor(private readonly userService: UserService) {}
}
