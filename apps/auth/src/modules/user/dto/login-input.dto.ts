import { SessionMetadataDto } from '@libs/contracts/index';
import { UserWithPassword } from './user.dto';

export class LoginInputDto {
  metadata: SessionMetadataDto;
  loginDto: UserWithPassword;
}
