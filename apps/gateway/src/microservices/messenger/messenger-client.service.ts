import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Microservice } from "@libs/constants/microservices";

@Injectable()
export class MessengerClientService {
	constructor(@Inject(Microservice.MESSENGER) private readonly client: ClientProxy) {}
}
