import { Injectable } from "@nestjs/common";
import * as net from "net";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";
import { FilesClientEnvConfig } from "@gateway/microservices/files/files-client.config";
import * as busboy from "busboy";
import { Request } from "express";
import { FileUploadOptionsDto } from "@gateway/dto/file-upload-options.dto";

// Интерфейс для результата загрузки
interface StreamUploadResult {
	success: boolean;
	files: UploadFileOutputDto[];
	errors?: string[];
}

/**
 * *Сервис отвечает за загрузку файлов в файловый сервис через TCP поток по отдельному порту
 */
@Injectable()
export class StreamClientService {
	constructor(private readonly filesClientConfig: FilesClientEnvConfig) {}

	async streamFilesToService(req: Request, config: FileUploadOptionsDto): Promise<StreamUploadResult> {
		return new Promise((resolve, reject) => {
			const results: UploadFileOutputDto[] = [];
			const errors: string[] = [];
			const bb = busboy({ headers: req.headers, limits: { fileSize: config.maxSize } });

			let filesProcessed = 0;
			let expectedFiles = 0;
			let isFinished = false;

			bb.on("file", async (fieldname, file, info) => {
				// Проверяем имя поля
				if (fieldname !== config.fieldName) {
					file.resume(); // Игнорируем файлы с неправильным полем
					return;
				}

				file.on("limit", () => {
					file.resume(); // остановить чтение
					resolve({
						success: false,
						files: [],
						errors: [`File ${info.filename} exceeds the limit`],
					});
				});

				// Проверяем лимит файлов
				if (config.maxFiles && expectedFiles >= config.maxFiles) {
					file.resume();
					resolve({
						success: false,
						files: [],
						errors: ["Max files limit exceeded"],
					});
					// throw new BadRequestRpcException('Max files limit exceeded');
				}

				// Проверяем MIME тип
				if (config.allowedTypes && !config.allowedTypes.includes(info.mimeType)) {
					file.resume();
					resolve({
						success: false,
						files: [],
						errors: [`File ${info.filename} has an invalid MIME type`],
					});
				}

				expectedFiles++;

				try {
					const uploadResult = await this.streamSingleFile(file, info.filename, config.folder, info.mimeType, config.fileSizes);

					results.push(uploadResult);
				} catch (error) {
					errors.push(`File ${info.filename}: ${(error as Error).message}`);
				} finally {
					filesProcessed++;

					// Проверяем, все ли файлы обработаны
					if (isFinished && filesProcessed === expectedFiles) {
						resolve({
							success: results.length > 0,
							files: results,
							errors: errors.length > 0 ? errors : undefined,
						});
					}
				}
			});

			bb.on("error", (error) => {
				console.error("Busboy error:", error);
				reject(error);
			});

			bb.on("finish", () => {
				console.log("Files form stream processing finished");
				isFinished = true;

				if (expectedFiles === 0 && filesProcessed === 0 && results.length === 0) {
					resolve({
						success: false,
						files: [],
						errors: ["No files uploaded"],
					});
				}
				// Если файлов не было или все уже обработаны
				if (expectedFiles === 0 || filesProcessed === expectedFiles) {
					resolve({
						success: results.length > 0,
						files: results,
						errors: errors.length > 0 ? errors : undefined,
					});
				}
			});

			req.pipe(bb);
		});
	}

	// Метод для загрузки одного файла через TCP поток
	private streamSingleFile(
		fileStream: NodeJS.ReadableStream,
		filename: string,
		folder: string,
		mimeType: string,
		fileSizes: string[],
	): Promise<UploadFileOutputDto> {
		return new Promise((resolve, reject) => {
			const socket = net.connect(this.filesClientConfig.filesClientStreamingPort, this.filesClientConfig.filesClientHost);

			let responseBuffer = "";
			let timeout: NodeJS.Timeout;

			timeout = setTimeout(() => {
				socket.destroy();
				reject(new Error("Upload timeout"));
			}, 60000);

			socket.on("connect", () => {
				console.log(`Connected to files service for: ${filename}`);

				// biome-ignore lint/style/useTemplate: <serializing>
				const header =
					JSON.stringify({
						originalname: filename,
						folder: folder,
						mimeType: mimeType,
						fileSizes: fileSizes,
					}) + "\n";

				socket.write(header);
				fileStream.pipe(socket, { end: false });

				fileStream.on("end", () => {
					console.log(`File stream ended for: ${filename}`);
					socket.end();
				});

				fileStream.on("error", (error) => {
					console.error(`File stream error for ${filename}:`, error);
					socket.destroy();
					reject(error);
				});
			});

			socket.on("data", (data) => {
				responseBuffer += data.toString();

				try {
					const response = JSON.parse(responseBuffer.trim());
					clearTimeout(timeout);

					if (response.success) {
						resolve(response);
					} else {
						reject(new Error(response.error || "Upload failed"));
					}
				} catch (e) {
					console.error(`Error parsing response: ${e.message}`);
				}
			});

			socket.on("close", () => {
				clearTimeout(timeout);
				if (responseBuffer.trim()) {
					try {
						const response = JSON.parse(responseBuffer.trim());
						if (response.success) {
							resolve(response);
						} else {
							reject(new Error(response.error || "Upload failed"));
						}
					} catch (e) {
						reject(new Error(`Invalid response: ${responseBuffer}, message: ${e.message}`));
					}
				} else {
					reject(new Error("No response from files service"));
				}
			});

			socket.on("error", (error) => {
				clearTimeout(timeout);
				reject(error);
			});
		});
	}
}
