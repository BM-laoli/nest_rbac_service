import { SetMetadata } from '@nestjs/common';

export const MYSQL_ENTITY_CLASS = 'MYSQL_ENTITY_CLASS';
export const MysqlEntityClass = (entity: any) =>
  SetMetadata(MYSQL_ENTITY_CLASS, entity);
