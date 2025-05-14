// 写一个 userinfo 服务
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectEntityManager('der_w_calorie')
    private userInfoRepository: EntityManager,
  ) {}

  // 写一个测试代码  从db 获取所有用户信息
  async getUserInfo() {
    return this.userInfoRepository.query('select * from user_info');
  }
}