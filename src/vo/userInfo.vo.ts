import { Exclude, Expose } from 'class-transformer';
import { User_db2 } from 'src/entities/rbac_db_1/te2.entity';

export class VOTest extends User_db2 {
  @Exclude()
  id: number;

  @Expose()
  get full_username(): string {
    return `___${this.username}`;
  }

  constructor(partial: Partial<VOTest>) {
    super();
    Object.assign(this, partial);
  }
}
