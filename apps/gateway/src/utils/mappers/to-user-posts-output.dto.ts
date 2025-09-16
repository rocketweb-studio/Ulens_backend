import { PostImagesOutputDto, ProfileOutputWithAvatarDto } from "@libs/contracts/index";
import { UserPostsPageDto } from "@libs/contracts/index";
import { UserPostsOutputDto } from "@libs/contracts/index";

export function mapToUserPostsOutput(postsPage: UserPostsPageDto, profile: ProfileOutputWithAvatarDto, postImages: PostImagesOutputDto[]): UserPostsOutputDto {
	const ts = (d: Date | string) => (typeof d === "string" ? Date.parse(d) : d.getTime());

	// группируем по postId (parentId)
	const imagesByPostId: Record<string, PostImagesOutputDto[]> = {};
	for (const img of postImages) {
		if (!imagesByPostId[img.parentId]) {
			imagesByPostId[img.parentId] = [];
		}
		imagesByPostId[img.parentId].push(img);
	}

	// сортируем внутри поста: новые - старые
	for (const arr of Object.values(imagesByPostId)) {
		arr.sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
	}

	return {
		totalCount: postsPage.totalCount,
		pageSize: postsPage.pageSize,
		items: postsPage.items.map((p) => ({
			id: p.id,
			userName: profile.userName,
			description: p.description,
			location: {
				city: profile.city,
				country: profile.country,
				region: profile.region,
			},
			images: (imagesByPostId[p.id] ?? []).map((img) => ({
				url: img.url,
				width: img.width,
				height: img.height,
				fileSize: img.fileSize,
				size: img.size,
				// нормализация в string
				createdAt: typeof img.createdAt === "string" ? img.createdAt : img.createdAt.toISOString(),
				uploadId: img.id,
			})),
			createdAt: p.createdAt, //  ISO
			updatedAt: p.updatedAt, //  ISO
			ownerId: profile.id,
			avatarOwner: profile.avatars.find((avatar) => avatar.width === 45)?.url ?? null,
			owner: {
				firstName: profile.firstName,
				lastName: profile.lastName,
			},
			likeCount: 0,
			isLiked: false,
			avatarWhoLikes: false,
		})),
		pageInfo: postsPage.pageInfo,
	};
}
