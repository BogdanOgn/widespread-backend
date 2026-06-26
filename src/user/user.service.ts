import { Injectable } from '@nestjs/common';

import { UserRoleEnum } from '../generated/prisma/enums';
import { UserModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(username: string, hashedPassword: string) {
    return this.prismaService.user.create({
      data: { username, password: hashedPassword, role: UserRoleEnum.USER },
    });
  }

  findByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: {
        username,
      },
    });
  }

  findById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  toResponse(user: UserModel) {
    return {
      id: Number(user.id),
      name: user.username,
      role: user.role,
      avatar_url: user.avatarUrl,
    };
  }
}
