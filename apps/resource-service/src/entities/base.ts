import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}
