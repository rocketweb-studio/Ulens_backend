import { PrismaClient as AuthPrismaClient } from "@auth/core/prisma/generated";
import { PrismaClient as MainPrismaClient } from "@main/core/prisma/generated";
import { PrismaClient as FilesPrismaClient } from "@files/core/prisma/generated";

type Clients = {
	auth: AuthPrismaClient;
	main: MainPrismaClient;
	files: FilesPrismaClient;
};

export function getPrismaClient<S extends keyof Clients>(service: S): Clients[S] {
	switch (service) {
		case "auth": {
			const url = process.env.AUTH_POSTGRES_URL;
			if (!url) throw new Error("AUTH_POSTGRES_URL is not set");
			return new AuthPrismaClient() as Clients[S];
		}
		case "main": {
			const url = process.env.MAIN_POSTGRES_URL;
			if (!url) throw new Error("MAIN_POSTGRES_URL is not set");
			return new MainPrismaClient() as Clients[S];
		}
		case "files": {
			const url = process.env.FILES_POSTGRES_URL;
			if (!url) throw new Error("FILES_POSTGRES_URL is not set");
			return new FilesPrismaClient() as Clients[S];
		}
	}
}
