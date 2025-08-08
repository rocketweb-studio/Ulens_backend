export interface IAuthService {
  login(data: { username: string; password: string }): Promise<{ accessToken: string }>;
}