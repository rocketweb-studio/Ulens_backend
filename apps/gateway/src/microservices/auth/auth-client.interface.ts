// Data Transfer Objects
export interface CreateUserDto {
  readonly name: string;
  readonly email: string;
}

export interface UserViewDto {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

// Service Interface
export interface IAuthClientService {
  /**
   * Get all users from the auth service
   * @returns Promise<UserViewDto[]> - Array of users
   */
  getUsers(): Promise<UserViewDto[]>;

  /**
   * Create a new user in the auth service
   * @param createUserDto - User creation data
   * @returns Promise<UserViewDto> - Created user data
   */
  createUser(createUserDto: CreateUserDto): Promise<UserViewDto>;
}

// Message patterns for microservice communication
export interface AuthMessagePatterns {
  get_users: { cmd: 'get_users' };
  create_user: { cmd: 'create_user' };
  get_user_by_id: { cmd: 'get_user_by_id' };
}

// Response types for microservice communication
export interface AuthServiceResponses {
  get_users: UserViewDto[];
  create_user: UserViewDto;
  get_user_by_id: UserViewDto | null;
}
