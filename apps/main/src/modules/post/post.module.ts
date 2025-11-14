import { Module } from "@nestjs/common";
import { PostController } from "@main/modules/post/post.controller";
import { PostService } from "@main/modules/post/post.service";
import { IPostCommandRepository, IPostQueryRepository } from "@main/modules/post/post.interface";
import { PrismaPostCommandRepository } from "@main/modules/post/repositories/post.command.repository";
import { PrismaPostQueryRepository } from "@main/modules/post/repositories/post.query.repository";
import { EventStoreModule } from "@main/modules/event-store/event-store.module";
import { CommentModule } from "@main/modules/comment/comment.module";
import { LikeModule } from "@main/modules/like/like.module";
@Module({
	imports: [EventStoreModule, CommentModule, LikeModule],
	providers: [
		{ provide: IPostCommandRepository, useClass: PrismaPostCommandRepository },
		{ provide: IPostQueryRepository, useClass: PrismaPostQueryRepository },
		PostService,
	],
	controllers: [PostController],
	exports: [PostService],
})
export class PostModule {}
