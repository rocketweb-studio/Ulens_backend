import { CreateUserDto } from "./input/create-user.dto";
import { BaseUserView } from "./output/base-user-view.dto";


// Service Interface
export interface IAuthClientService {
  /**
   * Get all users from the auth service
   * @returns Promise<UserViewDto[]> - Array of users
   */
  getUsers(): Promise<BaseUserView[]>;

  /**
   * Create a new user in the auth service
   * @param createUserDto - User creation data
   * @returns Promise<UserViewDto> - Created user data
   */
  createUser(createUserDto: CreateUserDto): Promise<BaseUserView>;
}
