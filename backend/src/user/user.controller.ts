import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AllowNoLogin } from 'src/common/custom.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @AllowNoLogin()
  @ApiOperation({ summary: '登录' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.login(loginUserDto);
    const token = this.jwtService.sign(
      {
        username: user.username,
        uid: user.id,
      },
      {
        expiresIn: '3h',
      },
    );
    return { user, token };
  }

  @Post('register')
  @AllowNoLogin()
  @ApiOperation({ summary: '注册用户' })
  register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  // 修改密码
  @Patch(':id/update_password')
  @ApiOperation({ summary: '修改用户密码' })
  updatePasswd(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改用户信息' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Get('init_db')
  @AllowNoLogin()
  init() {
    return this.userService.init();
  }
  @Get(':id')
  @ApiOperation({ summary: '用户信息' })
  profile(@Param('id') id: string) {
    console.log(id);
  }
}
