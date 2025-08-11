import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches } from "class-validator";

// Data Transfer Objects
export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]*$',
  })
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'userName allows only letters, numbers, _ and -',
  })
  userName: string;

  @ApiProperty({
    example: 'user.email@gmail.com',
    format: 'email',
    description: 'Unique email',
  })
  @IsEmail()
  email: string;
};

export class UserViewDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 'user.email@gmail.com' }) email: string;
  @ApiProperty({ example: 'John Doe' }) name: string;
  @ApiProperty({ example: '2025-08-10T00:00:00.000Z' }) createdAt: Date;
};

export class UsersModel {
  @ApiProperty({ type: [UserViewDto] }) items: UserViewDto[];
}

// Service Interface
export interface IAuthClientService {
  /**
   * Get all users from the auth service
   * @returns Promise<UserViewDto[]> - Array of users
   */
  getUsers(): Promise<UserViewDto[]>;

  /**
   * Create a new user in the auth service
   * @param createUserDto - User creation data
   * @returns Promise<UserViewDto> - Created user data
   */
  createUser(createUserDto: CreateUserDto): Promise<UserViewDto>;
}

// Message patterns for microservice communication
export interface AuthMessagePatterns {
  get_users: { cmd: 'get_users' };
  create_user: { cmd: 'create_user' };
  get_user_by_id: { cmd: 'get_user_by_id' };
}

// Response types for microservice communication
export interface AuthServiceResponses {
  get_users: UserViewDto[];
  create_user: UserViewDto;
  get_user_by_id: UserViewDto | null;
}
