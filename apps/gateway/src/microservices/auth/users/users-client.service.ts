import { AuthMessages } from "@libs/constants/index";
import { SearchUsersInputDto, SearchUsersOutputDto, UsersCountOutputDto } from "@libs/contracts/index";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Microservice } from "@libs/constants/microservices";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class UsersClientService {
	constructor(@Inject(Microservice.AUTH) private readonly client: ClientProxy) {}

	async getUsersCount(): Promise<UsersCountOutputDto> {
		return await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS_COUNT }, {}));
	}

	async getUsersBySearch(dto: SearchUsersInputDto): Promise<SearchUsersOutputDto> {
		return await firstValueFrom(this.client.send({ cmd: AuthMessages.GET_USERS_BY_SEARCH }, dto));
	}
}
