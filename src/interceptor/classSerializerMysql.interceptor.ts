import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map, Observable, retry } from 'rxjs';
import { MYSQL_ENTITY_CLASS } from 'src/decorators/MysqlEntityClass.decorator';

@Injectable()
export class ClassSerializerMysqlInterceptor extends ClassSerializerInterceptor {
  // 扩展一个方法
  transform(MysqlEntity, data) {
    return Array.isArray(data)
      ? data.map((obj) => {
          return new MysqlEntity(obj);
        })
      : MysqlEntity(data);
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
        return classToPlain(this.transform(MysqlEntity, data));
      }),
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
        return this.serialize(res, options);
      }),
    );
  }
}
