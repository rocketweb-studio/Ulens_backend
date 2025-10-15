import "socket.io";

// расширение типа Socket для добавления userId
declare module "socket.io" {
	interface Socket {
		userId?: string;
	}
}
