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

// Message patterns for microservice communication
export interface MainClientMessagePatterns {
  get_subscriptions: { cmd: 'get_subscriptions' };
  create_subscription: { cmd: 'create_subscription' };
}

// Response types for microservice communication
export interface MainServiceResponses {
  get_subscriptions: SubscriptionViewDto[];
  create_subscription: SubscriptionViewDto;
}
