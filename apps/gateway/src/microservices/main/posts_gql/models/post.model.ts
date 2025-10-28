import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class ImageModel {
	@Field(() => String)
	url: string;
	@Field(() => Number)
	width: number;
	@Field(() => Number)
	height: number;
	@Field(() => Number)
	fileSize: number;
	@Field(() => String)
	createdAt: string;
}

@ObjectType()
class PostImageModel {
	@Field(() => [ImageModel])
	small: ImageModel[];
	@Field(() => [ImageModel])
	medium: ImageModel[];
}

@ObjectType()
class OwnerModel {
	@Field(() => String)
	firstName: string;
	@Field(() => String)
	lastName: string;
}

@ObjectType()
export class PostModel {
	@Field(() => String)
	id: string;
	@Field(() => String)
	ownerId: string;
	@Field(() => String)
	userName: string;
	@Field(() => String)
	description: string;
	@Field(() => String)
	createdAt: string;
	@Field(() => String)
	updatedAt: string;
	@Field(() => PostImageModel)
	images: PostImageModel;
	@Field(() => String)
	avatarOwner: string;
	@Field(() => OwnerModel)
	owner: OwnerModel;
	@Field(() => Number)
	likeCount: number;
	@Field(() => Boolean)
	isLiked: boolean;
	@Field(() => Boolean)
	avatarWhoLikes: boolean;
}

@ObjectType()
class PageInfoModel {
	@Field(() => String, { nullable: true })
	endCursorPostId?: string;
	@Field(() => Boolean)
	hasNextPage: boolean;
}

@ObjectType()
export class PostsResponse {
	@Field(() => Number)
	totalCount: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => [PostModel])
	items: PostModel[];

	@Field(() => PageInfoModel)
	pageInfo: PageInfoModel;
}
