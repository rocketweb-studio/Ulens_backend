/* eslint-disable @typescript-eslint/no-empty-object-type */
// Data Transfer Objects
export type CreateSubscriptionDto = {
  readonly typeSubscription: string;
  readonly paymentType: string;
  readonly amount: number;
  readonly baseUrl: string;
};

export type SubscriptionViewDto = {
  id: number;
  typeSubscription: string;
  paymentType: string;
  amount: number;
  baseUrl: string;
};

// Service Interface

export interface IMainClientService {
  getSubscriptions(): Promise<SubscriptionViewDto[]>;
  createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionViewDto>
}

