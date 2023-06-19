import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { MYSQL_ENTITY_CLASS } from 'src/core/decorators/mysqlEntityClass.decorator';

@Injectable()
export class ClassSerializerMysqlInterceptor extends ClassSerializerInterceptor {
  // 扩展一个方法
  transform(MysqlEntity, data) {
    return Array.isArray(data)
      ? data.map((obj) => {
          return new MysqlEntity(obj);
        })
      : new MysqlEntity(data);
  }

  // 重写这个方法
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const MysqlEntity = this.reflector?.getAllAndOverride(MYSQL_ENTITY_CLASS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };

    return next.handle().pipe(
      map((data) => {
        return instanceToPlain(this.transform(MysqlEntity, data), {});
      }),
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
        return this.serialize(res, options);
      }),
    );
  }
}
