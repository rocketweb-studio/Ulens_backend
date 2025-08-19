import { initSettings } from "./helpers/init-settings";
import { MockTestManager } from "./helpers/mock-test-manager";

// тесты для MockController
describe("MockController", () => {
	let mockTestManager: MockTestManager;

	beforeAll(async () => {
		const result = await initSettings();
		mockTestManager = result.mockTestManger;
	});

	describe("getMock", () => {
		it("should return mock", async () => {
			const mockResult = await mockTestManager.getMock();
			expect(mockResult.version).toBe("1.0.0");
		});
	});
});
