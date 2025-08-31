import { StorageService } from "@files/core/storage/storage.service";
import * as net from "net";
import * as sharp from "sharp";

// Сервер для streaming
export class StreamingServer {
	private server: net.Server;

	constructor(
		private readonly storageService: StorageService,
		private readonly port: number,
	) {
		this.port = port;
	}

	// Запускаем TCP сервер для streaming
	async start(): Promise<void> {
		return new Promise((resolve) => {
			this.server = net.createServer((socket) => {
				this.handleConnection(socket);
			});

			this.server.listen(this.port, () => {
				console.log(`Streaming server listening on port ${this.port}`);
				resolve();
			});
		});
	}

	// Останавливаем TCP сервер для streaming
	async stop(): Promise<void> {
		return new Promise((resolve) => {
			if (this.server) {
				this.server.close(() => {
					console.log("Streaming server stopped");
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

	// Обрабатываем соединение с клиентом
	private handleConnection(socket: net.Socket) {
		console.log("New streaming connection established");

		let filename: string | null = null;
		let expectedSize: number | null = null;
		let headerReceived = false;
		let fileBuffer = Buffer.alloc(0);
		let isProcessing = false;

		// Обрабатываем данные от клиента
		socket.on("data", async (data) => {
			console.log(`Received chunk: ${data.length} bytes`);

			// Если хочешь видеть прогресс:
			console.log(`Progress: ${fileBuffer.length}/${expectedSize ?? "?"} bytes`);
			try {
				if (!headerReceived) {
					// Читаем заголовок с filename и размером
					const dataStr = data.toString();
					const newlineIndex = dataStr.indexOf("\n");

					// Если заголовок найден
					if (newlineIndex !== -1) {
						const headerStr = dataStr.substring(0, newlineIndex);
						const header = JSON.parse(headerStr);
						filename = header.filename;
						expectedSize = header.size;
						headerReceived = true;

						console.log(`Starting stream for upload ${filename}, expected size: ${expectedSize}`);

						// Обрабатываем оставшиеся данные после заголовка
						const remainingData = data.slice(newlineIndex + 1);
						if (remainingData.length > 0) {
							fileBuffer = Buffer.concat([fileBuffer, remainingData]);
						}
					}
				} else {
					// Накапливаем данные файла в буфер
					fileBuffer = Buffer.concat([fileBuffer, data]);
				}

				// Проверяем, получили ли мы весь файл
				if (headerReceived && expectedSize && fileBuffer.length >= expectedSize && !isProcessing) {
					isProcessing = true;
					console.log(`File completely received: ${fileBuffer.length}/${expectedSize} bytes`);
					//@ts-expect-error
					await this.processFile(socket, filename, fileBuffer.slice(0, expectedSize));
				}
			} catch (error) {
				console.error("Error processing stream data:", error);
				if (!socket.destroyed && socket.writable) {
					socket.write(JSON.stringify({ error: error.message }));
					socket.end();
				}
			}
		});

		socket.on("end", async () => {
			// Обрабатываем файл, если он еще не был обработан
			if (!isProcessing && filename && fileBuffer.length > 0) {
				isProcessing = true;
				console.log(`Stream ended for upload ${filename}, received ${fileBuffer.length} bytes`);
				await this.processFile(socket, filename, fileBuffer);
			}
		});

		// Обрабатываем ошибку соединения с клиентом
		socket.on("error", async (error) => {
			console.error("Socket error:", error);
			if (filename) {
				console.log("Error cleaning up upload");
			}
		});

		// Обрабатываем закрытие соединения с клиентом
		socket.on("close", () => {
			console.log("Streaming connection closed");
		});
	}

	// Обрабатываем файл, сжимаем его и загружаем в S3, возвращаем результат клиенту
	private async processFile(socket: net.Socket, filename: string, fileBuffer: Buffer) {
		try {
			console.log("Processing file with Sharp...");
			const image = await sharp(fileBuffer).resize(512, 512).webp().toBuffer();
			await this.storageService.uploadFile(image, filename, "image/webp");

			const result = {
				success: true,
				filename: filename,
				fileSize: fileBuffer.length,
				message: "File uploaded successfully",
			};

			console.log("Sending response:", result);

			if (!socket.destroyed && socket.writable) {
				// biome-ignore lint/style/useTemplate: <explanation>
				socket.write(JSON.stringify(result) + "\n", () => {
					// Не закрываем соединение - пусть клиент сам закроет
				});
			} else {
				console.log("Socket already closed, cannot send response");
			}
		} catch (error) {
			console.error("Error processing image:", error);

			if (!socket.destroyed && socket.writable) {
				// biome-ignore lint/style/useTemplate: <explanation>
				socket.write(JSON.stringify({ error: error.message }) + "\n");
			}
		}
	}
}
