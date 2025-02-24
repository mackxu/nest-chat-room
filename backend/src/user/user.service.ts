import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== loginUserDto.password) {
      throw new BadRequestException('密码错误');
    }
    delete user.password;
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async init() {
    await this.prisma.user.createMany({
      data: [
        {
          username: 'admin',
          password: '123123',
          email: 'aaa@qq.com',
        },
        {
          username: 'zhangsan',
          password: '123123',
          email: 'zhangsan@qq.com',
        },
        {
          username: 'lisi',
          password: '123123',
          email: 'lisi@163.com',
        },
      ],
    });
    return 'done';
  }
}
