export const mockRabbitChannel = {
	assertExchange: jest.fn(),
	assertQueue: jest.fn(),
	bindQueue: jest.fn(),
	prefetch: jest.fn(),
	publish: jest.fn(),
	consume: jest.fn(),
	close: jest.fn(),
};

export const mockRabbitConnection = {
	createChannel: jest.fn().mockResolvedValue(mockRabbitChannel),
	close: jest.fn(),
	on: jest.fn(),
};
