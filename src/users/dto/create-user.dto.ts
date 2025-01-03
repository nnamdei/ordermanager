import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique username of the user',
    example: 'john_doe',
  })
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  username: string;

  @ApiProperty({
    description:
      'The password of the user. It must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'P@ssw0rd123',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(32, { message: 'Password must not exceed 32 characters.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MinLength(2, { message: 'First name must be at least 2 characters long.' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long.' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName: string;
}
