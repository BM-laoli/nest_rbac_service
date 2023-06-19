import { Controller, Delete, Get, Post, Put, Scope } from '@nestjs/common';
import UserService from '../services/user.service';

@Controller({
  path: '/user',
  scope: Scope.REQUEST,
})
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users-page')
  getUserList() {}

  @Get('user-info')
  getUserInfo() {}

  @Put('update-user')
  updateUser() {}

  @Delete('delete-user')
  deleteUser() {}
}
