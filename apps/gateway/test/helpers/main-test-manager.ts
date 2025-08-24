import { INestApplication } from "@nestjs/common";
import { MainMessages, Microservice } from "@libs/constants/index";

export class MainTestManager {
	constructor(private app: INestApplication) {}

	clearDatabase() {
		const client = this.app.get(Microservice.MAIN);
		return client.send(MainMessages.CLEAR_MAIN_DATABASE, {}).toPromise();
	}
}
