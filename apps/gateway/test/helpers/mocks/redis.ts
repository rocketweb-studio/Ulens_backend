export const mockRedisService = {
	get: jest.fn().mockResolvedValue(null), // или любое значение
	set: jest.fn().mockResolvedValue("OK"),
	del: jest.fn().mockResolvedValue(1),
};
