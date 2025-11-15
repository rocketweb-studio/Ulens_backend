import { Module } from "@nestjs/common";
import { EventStoreModule } from "@main/modules/event-store/event-store.module";
import { CommentService } from "./comment.service";
import { ICommentCommandRepository, ICommentQueryRepository } from "./comment.interface";
import { PrismaCommentCommandRepository } from "./repositiries/comment.command.repository";
import { PrismaCommentQueryRepository } from "./repositiries/comment.query.repository";

@Module({
	imports: [EventStoreModule],
	providers: [
		{ provide: ICommentCommandRepository, useClass: PrismaCommentCommandRepository },
		{ provide: ICommentQueryRepository, useClass: PrismaCommentQueryRepository },
		CommentService,
	],
	exports: [
		CommentService,
		{ provide: ICommentCommandRepository, useClass: PrismaCommentCommandRepository },
		{ provide: ICommentQueryRepository, useClass: PrismaCommentQueryRepository },
	],
})
export class CommentModule {}
