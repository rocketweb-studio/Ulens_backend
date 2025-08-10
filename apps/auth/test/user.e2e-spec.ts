import { initSettings } from './helpers/init-settings';
import { UserTestManager } from './helpers/user-test-manager';

// тесты для MockController
describe('UserController', () => {
  let userTestManager: UserTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    userTestManager = result.userTestManger;
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const userResult = await userTestManager.getUsers();
      expect(userResult).toBeDefined();
      expect(userResult).toBeInstanceOf(Array);
    });
  });
});
