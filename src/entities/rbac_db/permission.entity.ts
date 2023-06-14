import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn()
  id: number;
}
