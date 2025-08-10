import { IsEmail, IsString, Length } from 'class-validator';

const loginConstraints = {
  minLength: 3,
  maxLength: 20
};

export class CreateUserDto {
  // for swagger --    @ApiProperty({ example: 'login' })
  @IsString()
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  readonly name: string;

  // for swagger --    @ApiProperty({ example: 'example@example.com' })
  @IsString()
  @IsEmail()
  readonly email: string;
}

export class RegistrationInputDto extends CreateUserDto {}
