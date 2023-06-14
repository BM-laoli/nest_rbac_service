import { Injectable } from '@nestjs/common';
import {
  InjectConnection,
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { User_db1 } from '../../entities/rbac_db/te1.entity';
import { User_db2 } from '../../entities/rbac_db_1/te2.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User_db1, 'rbac_db')
    private readonly user_db1Repository: Repository<User_db1>,
    @InjectRepository(User_db2, 'rbac_db_1')
    private readonly user_db2Repository: Repository<User_db2>, // @InjectEntityManager('rbac_db') // private entityManager: EntityManager, // @InjectEntityManager('rbac_db_1') // private entityManager2: EntityManager,
  ) {}

  async t1(data: any) {
    console.log(data);
    // this.entityManager.save(User_db1, data);
    throw new Error('error');

    // return this.user_db1Repository.save(data);
  }

  async t2(data: any) {
    return this.user_db2Repository.save(data);
  }
}
