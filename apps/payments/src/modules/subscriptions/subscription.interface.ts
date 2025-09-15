/**
 *Using abstract classes lets Nest use the class itself as the DI token,
 *   so your service can inject by type without @Inject()
 */

export abstract class ISubscriptionQueryRepository {
	// abstract getUserPosts(dto: GetUserPostsInputDto): Promise<UserPostsPageDto>;
	abstract getUniqueSubscription(code: string): Promise<any>;
}

export abstract class ISubscriptionCommandRepository {
	// abstract createPost(dto: CreatePostWithUserIdDto): Promise<CreatePostOutputDto>;
	// abstract getPostById(id: string): Promise<PostDbOutputDto | null>;
	// abstract deletePost(id: string): Promise<boolean>;
	// abstract updatePost(dto: UpdatePostDto): Promise<boolean>;
}
