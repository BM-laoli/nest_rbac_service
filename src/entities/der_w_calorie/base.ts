import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  // 以下三个是 公用的
  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}
