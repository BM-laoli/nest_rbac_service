import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { PermissionAB } from './permission-ab.entity';

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

  @Column({
    default: '2',
    comment: '按钮的类型 1:create 2:queryData, 3:delete 4:put  5:link',
  })
  type: number;

  @Column()
  description: string;

  // 虚拟键
  @OneToMany(() => PermissionAB, (permissionAB) => permissionAB.actionButton)
  permissionABs: PermissionAB[];
}
