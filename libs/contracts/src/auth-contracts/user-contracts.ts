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
    message: 'name allows only letters, numbers, _ and -',
  })
  name: string;

  @ApiProperty({
    example: 'user.email@gmail.com',
    format: 'email',
    description: 'Unique email',
  })
  @IsEmail()
  email: string;
};

export class BaseUserViewDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'user.email@gmail.com' })
  email: string;
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @ApiProperty({ example: '2025-08-10T00:00:00.000Z' })
  createdAt: Date;

  constructor(model: any) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }

  static mapToView(user: any): BaseUserViewDto {
    return new BaseUserViewDto(user);
  }

  static mapToViewList(users: any[]): BaseUserViewDto[] {
    return users.map(user => BaseUserViewDto.mapToView(user));
  }
}

export class UsersModel {
  @ApiProperty({ type: [BaseUserViewDto] }) items: BaseUserViewDto[];
}

// Service Interface
export interface IAuthClientService {
  /**
   * Get all users from the auth service
   * @returns Promise<UserViewDto[]> - Array of users
   */
  getUsers(): Promise<BaseUserViewDto[]>;

  /**
   * Create a new user in the auth service
   * @param createUserDto - User creation data
   * @returns Promise<UserViewDto> - Created user data
   */
  createUser(createUserDto: CreateUserDto): Promise<BaseUserViewDto>;
}

