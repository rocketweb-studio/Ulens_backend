import { IsNumber, IsString, Length } from 'class-validator';

const loginConstraints = {
  minLength: 3,
  maxLength: 20
};

export class CreateSubscriptionDto {
  // for swagger --    @ApiProperty({ example: 'login' })
  @IsString()
  readonly typeSubscription: string;

  @IsString()
  readonly paymentType: string;

  @IsNumber()
  readonly amount: number;

  // for swagger --    @ApiProperty({ example: 'example@example.com' })
  @IsString()
  readonly baseUrl: string;
}

// export class RegistrationInputDto extends CreateSubscriptionDto {}
