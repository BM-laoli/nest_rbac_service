import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base';

@Entity({ name: 'App' }) // 默认生成同步表的时候是小写，如果有特殊SQL要求 请自己改成大写
export class App extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  menu_ids: string;
}
