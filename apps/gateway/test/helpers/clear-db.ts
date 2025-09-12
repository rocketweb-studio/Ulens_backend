type Clients = {
	auth?: any;
	main?: any;
	files?: any;
};

export async function clearDbs(clients: Clients) {
	if (clients.auth) {
		const db = clients.auth;
		await db.session.deleteMany();
		await db.tokensBlacklist.deleteMany();
		await db.profile.deleteMany();
		await db.user.deleteMany();
	}

	if (clients.main) {
		const db = clients.main;
		await db.post.deleteMany();
	}

	if (clients.files) {
		const db = clients.files;
		await db.avatar.deleteMany();
		await db.post.deleteMany();
	}
}
