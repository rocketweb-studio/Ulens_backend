import { Module } from "@nestjs/common";
import { ILikeCommandRepository, ILikeQueryRepository } from "@main/modules/like/like.interface";
import { LikeService } from "@main/modules/like/like.service";
import { PrismaLikeCommandRepository } from "@main/modules/like/repositories/like.command.repository";
import { LikeController } from "@main/modules/like/like.controller";
import { PrismaLikeQueryRepository } from "@main/modules/like/repositories/like.query.repository";
@Module({
	imports: [],
	providers: [
		{ provide: ILikeCommandRepository, useClass: PrismaLikeCommandRepository },
		{ provide: ILikeQueryRepository, useClass: PrismaLikeQueryRepository },
		LikeService,
	],
	controllers: [LikeController],
	exports: [LikeService],
})
export class LikeModule {}
