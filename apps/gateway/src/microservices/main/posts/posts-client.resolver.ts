import { Query, Resolver } from "@nestjs/graphql";
import { PostsClientService } from "./posts-client.service";
import { PostModel } from "./models/post.model";

@Resolver("Posts")
export class PostsClientResolver {
	constructor(private readonly postsClientService: PostsClientService) {}

	// @UseGuards(GqlAuthGuard)
	@Query(() => PostModel, { name: "getPost" })
	async getLatestPosts() {
		return this.postsClientService.getLatestPosts();
	}

	// @Mutation(() => UserModel, { name: 'createAccount' })
	// async create(@Args('input') input: CreateUserInput) {
	//   return this.accountService.create(input);
	// }

	// @Mutation(() => Boolean, { name: 'changeEmail' })
	// @UseGuards(GqlAuthGuard)
	// async changeEmail(@Args('input') input: ChangeEmailInput, @ExtractUserFromRequest() user: User) {
	//   return this.accountService.changeEmail(input, user);
	// }

	// @Mutation(() => Boolean, { name: 'changePass' })
	// @UseGuards(GqlAuthGuard)
	// async changePass(@Args('input') input: ChangePassInput, @ExtractUserFromRequest() user: User) {
	//   return this.accountService.changePass(input, user);
	// }
}
