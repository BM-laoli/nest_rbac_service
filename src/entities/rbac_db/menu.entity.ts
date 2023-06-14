import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class Menu extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    comment: '菜单类型 1 目录 2 实际菜单',
  })
  type: number;

  @Column()
  description: string;

  @Column()
  parent: number;

  @Column()
  icon: string;
}
