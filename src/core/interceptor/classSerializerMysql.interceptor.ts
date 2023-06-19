import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { log } from 'console';
import { map, Observable, retry } from 'rxjs';
import { MYSQL_ENTITY_CLASS } from 'src/core/decorators/mysqlEntityClass.decorator';
import { VOTest } from 'src/vo/userInfo.vo';

@Injectable()
export class ClassSerializerMysqlInterceptor extends ClassSerializerInterceptor {
  // 扩展一个方法
  transform(MysqlEntity, data) {
    console.log('MysqlEntity');
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
        const vlaue = classToPlain(
          new VOTest({
            id: 1,
            username: '123',
          }),
        );

        const vlaue2 = instanceToPlain(this.transform(MysqlEntity, data), {});
        // return classToPlain(this.transform(MysqlEntity, data));
        return vlaue2;
      }),
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
        console.log(res);
        return this.serialize(res, options);
      }),
    );
  }
}
