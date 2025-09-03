import { StorageAdapter } from "@files/core/storage/storage.adapter";
import * as net from "net";
import * as sharp from "sharp";
import { PassThrough } from "stream";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";
import { randomUUID } from "crypto";

// TCP сервер для потоковой загрузки файлов
export class StreamingServer {
	private server: net.Server;

	constructor(
		private readonly storageService: StorageAdapter, // сервис для загрузки файлов в S3
		private readonly port: number, // порт, на котором будет слушать сервер
	) {
		this.port = port;
	}

	// Запуск TCP сервера
	async start(): Promise<void> {
		return new Promise((resolve) => {
			// создаём TCP сервер
			this.server = net.createServer({ allowHalfOpen: true }, (socket) => {
				socket.setNoDelay(true); // отключаем Nagle для минимизации задержек
				socket.setKeepAlive(true); // держим соединение активным
				this.handleConnection(socket); // обрабатываем новое подключение
			});

			// сервер начинает слушать указанный порт
			this.server.listen(this.port, () => {
				console.log(`Streaming server listening on port ${this.port}`);
				resolve();
			});
		});
	}

	// Остановка TCP сервера
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

	// Обработка нового TCP соединения
	private handleConnection(socket: net.Socket) {
		console.log("New streaming connection established");

		let originalname: string | null = null;
		let folder: string | null = null;
		let headerReceived = false;

		// Первый пакет от клиента всегда содержит заголовок (filename, size)
		socket.on("data", async (data) => {
			try {
				if (!headerReceived) {
					const dataStr = data.toString();
					const newlineIndex = dataStr.indexOf("\n");

					// ждём перевод строки — конец JSON-заголовка
					if (newlineIndex !== -1) {
						const headerStr = dataStr.substring(0, newlineIndex);
						const header = JSON.parse(headerStr);
						originalname = header.originalname;
						folder = header.folder;
						const size: number | undefined = header.size;
						headerReceived = true;

						console.log(`Starting stream for upload ${originalname}`);

						// Остаток данных после заголовка (первые байты файла)
						const remainingData = data.slice(newlineIndex + 1);

						// Передаём дальше на обработку файла
						if (remainingData.length > 0) {
							//@ts-expect-error
							await this.processStream(socket, folder, size, remainingData);
						} else {
							//@ts-expect-error
							await this.processStream(socket, folder, size);
						}
					}
				}
			} catch (err) {
				console.error("Error parsing header:", err);
				// отправляем клиенту ошибку, если заголовок некорректный
				socket.end(`${JSON.stringify({ error: "Invalid header" })}\n`);
			}
		});

		socket.on("error", (err) => {
			console.error("Socket error:", err);
		});

		socket.on("close", () => {
			console.log("Streaming connection closed");
		});
	}

	//todo поправить
	// Генерация имени файла с суффиксом размера
	private generateFilename(folder: string, size: string): string {
		const uniqueId = randomUUID();

		return `${folder}/${uniqueId}_${size}.webp`;
	}

	// Обработка потока файла после получения заголовка
	private async processStream(socket: net.Socket, folder: string, expectedSize?: number, firstChunk?: Buffer) {
		try {
			// Генерируем имена файлов для разных размеров
			const filename192 = this.generateFilename(folder, "192x192");
			const filename45 = this.generateFilename(folder, "45x45");
			let fileSize192: number = 0;
			let fileSize45: number = 0;
			console.log(`[PROCESS] Start processing file stream: ${filename192} and ${filename45}`);

			// Создаем два трансформера Sharp для разных размеров
			const transformer192 = sharp()
				.resize(192, 192)
				.webp()
				.on("info", (info) => {
					console.log(`[SHARP-192] Output info: width=${info.width}, height=${info.height}, size=${info.size}`);
					fileSize192 = info.size;
				})
				.on("error", (err) => {
					console.error("[SHARP-192] Error:", err);
				});

			const transformer45 = sharp()
				.resize(45, 45)
				.webp()
				.on("info", (info) => {
					console.log(`[SHARP-45] Output info: width=${info.width}, height=${info.height}, size=${info.size}`);
					fileSize45 = info.size;
				})
				.on("error", (err) => {
					console.error("[SHARP-45] Error:", err);
				});

			// PassThrough — прокси-поток для записи байтов файла
			const passThrough = new PassThrough();
			let received = 0;

			// Если остались данные после заголовка — пишем их первыми
			if (firstChunk && firstChunk.length > 0) {
				console.log(`[STREAM] Writing first chunk (${firstChunk.length} bytes)`);
				passThrough.write(firstChunk);
				received += firstChunk.length;
			}

			// Приём бинарных данных из сокета
			socket.on("data", (chunk) => {
				console.log(`[STREAM] Received chunk (${chunk.length} bytes)`);
				received += chunk.length;
				console.log(`[STREAM] Total received so far: ${received} bytes`);

				passThrough.write(chunk);

				// Если знаем размер файла и получили все данные → закрываем поток
				if (expectedSize && received >= expectedSize) {
					console.log("[STREAM] Expected size reached, ending passThrough");
					passThrough.end();
				}
			});

			// Клиент закрыл соединение → закрываем поток
			socket.on("end", () => {
				console.log("[SOCKET] Socket stream ended, closing passThrough");
				passThrough.end();
			});

			socket.on("close", () => {
				console.log("[SOCKET] Socket closed, ending passThrough");
				passThrough.end();
			});

			socket.on("error", (err) => {
				console.error("[SOCKET] Socket error:", err);
				passThrough.destroy(err);
			});

			// Создаем отдельные потоки для каждого трансформера
			const stream192 = new PassThrough();
			const stream45 = new PassThrough();

			// Дублируем данные из основного потока в два отдельных
			passThrough.on("data", (chunk) => {
				stream192.write(chunk);
				stream45.write(chunk);
			});

			passThrough.on("end", () => {
				stream192.end();
				stream45.end();
			});

			passThrough.on("error", (err) => {
				stream192.destroy(err);
				stream45.destroy(err);
			});

			// Загружаем обе версии параллельно
			console.log("[UPLOAD] Starting parallel uploads to S3...");

			await Promise.all([
				this.storageService.uploadFileStream(stream192.pipe(transformer192), filename192, "image/webp"),
				this.storageService.uploadFileStream(stream45.pipe(transformer45), filename45, "image/webp"),
			]);

			console.log("[UPLOAD] Both uploads finished successfully!");
			console.log(`[UPLOAD] 192x192 version: ${filename192}`);
			console.log(`[UPLOAD] 45x45 version: ${filename45}`);

			// Формируем успешный ответ клиенту с информацией об обеих версиях
			const result: UploadFileOutputDto = {
				success: true,
				versions: [
					{
						url: filename192,
						width: 192,
						height: 192,
						fileSize: fileSize192,
					},
					{
						url: filename45,
						width: 45,
						height: 45,
						fileSize: fileSize45,
					},
				],
			};

			if (!socket.destroyed && socket.writable) {
				console.log("[SOCKET] Sending success response to client");
				socket.end(`${JSON.stringify(result)}\n`);
			}
		} catch (error) {
			console.error("[PROCESS] Error processing stream:", error);

			// Отправляем клиенту ошибку
			if (!socket.destroyed && socket.writable) {
				console.log("[SOCKET] Sending error response to client");
				socket.end(`${JSON.stringify({ error: (error as Error).message })}\n`);
			}
		}
	}
}
