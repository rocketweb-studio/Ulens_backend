import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches } from "class-validator";
// ? import { Trim } from "@libs/utils/index" так и не получилось импортировать этот pipe из либы

// Data Transfer Objects
export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
    minLength: 6,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]*$'
  })
  // @Trim()
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'name allows only letters, numbers, _ and -'
  })
  userName: string;

  @ApiProperty({
    example: 'user.email@gmail.com',
    format: 'email',
    description: 'Unique email'
  })
  // @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:'MyP@ssw0rd!2025#',
    description: 'User password',
    minLength:6,
    maxLength:20,
    pattern: '^[0-9A-Za-z!"#$%&\'()*+,\\-./:;<=>?@[\\]\\\\^_{|}~]+$',
  })
  // @Trim()
  @IsString()
  @Length(6, 20)
  @Matches(/^[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\]\\^_{|}~]+$/, {
  message:
    'Allowed characters: 0-9, A-Z, a-z and special symbols ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
  })
  password : string;
};

export class BaseUserViewDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'user.email@gmail.com' })
  email: string;
  @ApiProperty({ example: 'John Doe' })
  userName: string;
  @ApiProperty({ example: '2025-08-10T00:00:00.000Z' })
  createdAt: Date;

  constructor(model: any) {
    this.userName = model.userName;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }

  static mapToView(user: any): BaseUserViewDto {
    return new BaseUserViewDto(user);
  }

  static mapToViewList(users: any[]): BaseUserViewDto[] {
    return users.map((user) => BaseUserViewDto.mapToView(user));
  }
}

export class RegistrationResultDto {
  user: BaseUserViewDto;
  confirmationCode: string;
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
