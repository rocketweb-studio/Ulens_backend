import { Controller } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ICommentQueryRepository } from "./comment.interface";

@Controller()
export class PostController {
	constructor(
		private readonly commentService: CommentService,
		private readonly commentQueryRepository: ICommentQueryRepository,
	) {}
}
