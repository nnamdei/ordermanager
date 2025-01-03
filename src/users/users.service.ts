import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email}" not found.`);
    }

    return user;
  }

  async findUserByUser(name: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: name,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${name}" not found.`);
    }

    return user;
  }

  async findUserByID(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ${id}" not found.`);
    }

    return user;
  }

  async create(params: CreateUserDto) {
    const { username, password, email, firstName, lastName } = params;

    try {
      // Check if the user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUser || existingUsername) {
        return {
          status: 'error',
          message: 'User with this email or username already exists.',
        };
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in the database
      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          firstName,
          lastName,
          email,
        },
      });

      // Return a success response with the created user's ID
      return {
        status: 'success',
        message: 'User successfully created.',
        data: { id: newUser.id },
      };
    } catch (error) {
      // Return a structured error message
      return {
        status: 'error',
        message: 'An error occurred while creating the user.',
        error: error.message || 'An error occurred',
      };
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      const data = await this.findUserByID(id);
      return {
        status: 'success',
        message: 'user fetched',
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'An error occurred while fetching the user.',
        error: error.message || 'An error occurred',
      };
    }
  }
}
