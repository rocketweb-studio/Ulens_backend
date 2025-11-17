export const getRoomByUserId = (userId: string) => {
	return `user:${userId}:notifications`;
};

export const getChatByRoomId = (roomId: number) => {
	return `chat:${roomId}`;
};

export const getAllRoomMessagesByUserId = (userId: string) => {
	return `room:${userId}:all-room-messages`;
};
