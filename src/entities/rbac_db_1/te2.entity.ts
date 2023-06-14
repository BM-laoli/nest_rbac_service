import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User_db2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
