import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(params: LoginDto) {
    try {
      const { email, password } = params;

      // Fetch user by email
      const user = await this.prisma.user.findUnique({ where: { email } });

      // Validate user existence and password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate access token
      const accessToken = await this.getToken(user.id, user.role);

      // Return success response
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      };
    } catch (error) {
      // Log error for debugging purposes
      console.error('Error during login:', error.message || error);

      // Handle specific error types or return generic error message
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw to preserve specific error details
      }

      throw new InternalServerErrorException(
        'An error occurred while processing the login request',
      );
    }
  }

  async getToken(userId: string, role: string) {
    const token = this.jwtService.signAsync(
      {
        sub: userId,
        role,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRY','1h'),
      },
    );
    return token;
  }
}
