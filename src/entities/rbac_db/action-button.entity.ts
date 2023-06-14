import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class ActionButton extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
    comment: '按钮编码 唯一！',
  })
  code: string;

  @Column()
  description: string;
}
