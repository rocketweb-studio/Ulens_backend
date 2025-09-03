import { AvatarInputDto } from "./dto/avatar.input.dto";

/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class IFilesCommandRepository {
	abstract saveAvatar(data: AvatarInputDto): Promise<boolean>;
}
