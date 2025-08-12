export class BaseSubscriptionViewDto {
  //   @ApiProperty({ example: 'email' })
  typeSubscription: string;
  //   @ApiProperty({ example: '1' })
  id: string;
  //   @ApiProperty({ example: 'login' })
  paymentType: string;
  //   @ApiProperty({ example: new Date() })
  amount: number;
  baseUrl: string;

  constructor(model: any) {
    this.id = model.id;
    this.typeSubscription = model.typeSubscription;
    this.paymentType = model.paymentType;
    this.amount = model.amount;
    this.baseUrl = model.baseUrl;
  }

  static mapToView(subscription: any): BaseSubscriptionViewDto {
    return new BaseSubscriptionViewDto(subscription);
  }

  static mapToViewList(subscriptions: any[]): BaseSubscriptionViewDto[] {
    return subscriptions.map(subscriptions => BaseSubscriptionViewDto.mapToView(subscriptions));
  }
}

