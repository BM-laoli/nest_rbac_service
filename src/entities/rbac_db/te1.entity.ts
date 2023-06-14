import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User_db1 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  update_time: number;

  @Column()
  create_time: number;

  @Column()
  email: string;

  @Column()
  state: number;
}
