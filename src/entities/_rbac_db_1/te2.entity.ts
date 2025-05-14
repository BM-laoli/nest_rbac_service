import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User_db2 {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
