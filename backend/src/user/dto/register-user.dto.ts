import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, { message: '用户名长度必须在3-20个字符之间' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;
  @IsNotEmpty({ message: '邮箱不能为空' })
  @Length(3, 20, { message: '邮箱长度必须在3-20个字符之间' })
  @IsEmail()
  email: string;
}
