import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { IPostCommandRepository, IPostQueryRepository } from "./post.interface";
import { PrismaPostCommandRepository } from "./repositories/post.command.repository";
import { PrismaPostQueryRepository } from "./repositories/post.query.repository";

@Module({
	imports: [],
	providers: [
		{ provide: IPostCommandRepository, useClass: PrismaPostCommandRepository },
		{ provide: IPostQueryRepository, useClass: PrismaPostQueryRepository },
		PostService,
	],
	controllers: [PostController],
	exports: [],
})
export class PostModule {}
