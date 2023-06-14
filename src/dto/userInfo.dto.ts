import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';

// 应对 无id 是创建 有id是修改的逻辑
class CreateTestDto {
  id: string;
}

export class TestDto extends PartialType(CreateTestDto) {
  @IsEmail()
  email: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
