import { StorageService } from "@files/core/storage/storage.service";
import * as net from "net";
import * as sharp from "sharp";
import { PassThrough } from "stream";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";

// TCP сервер для потоковой загрузки файлов
export class StreamingServer {
	private server: net.Server;

	constructor(
		private readonly storageService: StorageService, // сервис для загрузки файлов в S3
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

		let filename: string | null = null;
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
						filename = header.filename;
						const size: number | undefined = header.size;
						headerReceived = true;

						console.log(`Starting stream for upload ${filename}`);

						// Остаток данных после заголовка (первые байты файла)
						const remainingData = data.slice(newlineIndex + 1);

						// Передаём дальше на обработку файла
						if (remainingData.length > 0) {
							//@ts-expect-error
							await this.processStream(socket, filename, size, remainingData);
						} else {
							//@ts-expect-error
							await this.processStream(socket, filename, size);
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

	// Обработка потока файла после получения заголовка
	private async processStream(socket: net.Socket, filename: string, expectedSize?: number, firstChunk?: Buffer) {
		try {
			console.log(`[PROCESS] Start processing file stream: ${filename}`);

			// Sharp-трансформер: ресайз до 512x512 и конвертация в .webp
			const transformer = sharp()
				.resize(512, 512)
				.webp()
				.on("info", (info) => {
					console.log(`[SHARP] Output info: width=${info.width}, height=${info.height}, size=${info.size}`);
				})
				.on("error", (err) => {
					console.error("[SHARP] Error:", err);
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

			// Передаём поток в S3 (через Sharp-трансформацию)
			console.log("[UPLOAD] Starting upload to S3...");
			await this.storageService.uploadFileStream(passThrough.pipe(transformer), filename, "image/webp");
			console.log("[UPLOAD] Upload finished successfully!");

			// Формируем успешный ответ клиенту
			const result: UploadFileOutputDto = {
				success: true,
				filename,
				message: "File uploaded successfully",
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
