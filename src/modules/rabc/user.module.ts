import { Module } from '@nestjs/common';
import UserController from './controllers/user.controller';
import RoleController from './controllers/role.controller';
import MenuController from './controllers/menu.controller';
import ACBController from './controllers/actionButton.controller';
import PermissionController from './controllers/permission.controller';
import UserService from './services/user.service';
import RoleService from './services/role.service';
import MenuService from './services/menu.service';
import ACBService from './services/acb.service';
import PermissionService from './services/permission.service';

@Module({
  imports: [],
  controllers: [
    UserController,
    RoleController,
    MenuController,
    ACBController,
    PermissionController,
  ],
  providers: [
    UserService,
    RoleService,
    MenuService,
    ACBService,
    PermissionService,
  ],
})
export default class RBACModule {}
