import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base';

@Entity({ name: 'Menu' }) // 默认生成同步表的时候是小写，如果有特殊SQL要求 请自己改成大写
export class Menu extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: number;

  @Column()
  children_ids: string;

  @Column()
  parent_id: number;
}
