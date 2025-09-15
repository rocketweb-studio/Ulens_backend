import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
	constructor(redisUri: string) {
		super(redisUri);
		this.on("connect", () => console.log("[Redis] connect:", redisUri));
		this.on("ready", () => console.log("[Redis] ready"));
		this.on("reconnecting", () => console.log("[Redis] reconnecting..."));
		this.on("end", () => console.log("[Redis] end"));
		this.on("error", (e) => console.error("[Redis] error:", e.message));
	}
	async onModuleDestroy() {
		try {
			await this.quit();
		} catch {
			this.disconnect();
		}
	}
}
