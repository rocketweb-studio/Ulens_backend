import { Injectable } from "@nestjs/common";
import * as net from "net";
import { IFilesClientService } from "@libs/contracts/files-contracts/files.contract";
import { UploadFileOutputDto } from "@libs/contracts/files-contracts/output/upload-file.output.dto";
import { FilesClientEnvConfig } from "./files-client.config";

// Сервис отвечает за загрузку файлов в файловый сервис
@Injectable()
export class FilesClientService implements IFilesClientService {
	constructor(private readonly filesClientConfig: FilesClientEnvConfig) {}
	// загрузка одного файла по TCP
	async uploadFile(file: any, filename: string): Promise<UploadFileOutputDto> {
		try {
			const fileResult = await this.streamFileToService(file.buffer, filename);
			return fileResult;
		} catch (error) {
			console.error("Error uploading file:", error);
			throw error;
		}
	}
	// загрузка нескольких файлов по TCP и возвращает массив имен файлов для сохранения в базу данных
	async uploadFiles(files: any[], path: string): Promise<Array<string>> {
		try {
			const filenamesArray: string[] = [];
			files.map(async (file, index) => {
				const filename = `${path}__${index}.webp`;
				filenamesArray.push(filename);
				this.streamFileToService(file.buffer, filename);
			});
			return filenamesArray;
		} catch (error) {
			console.error("Error uploading files:", error);
			throw error;
		}
	}

	// загрузка файла по TCP и возвращает объект с информацией о загрузке
	private streamFileToService(fileBuffer: Buffer, filename: string): Promise<UploadFileOutputDto> {
		return new Promise((resolve, reject) => {
			// соединяемся с файловым сервисом по порту и хосту по отдельному TCP соединению
			const socket = net.connect(this.filesClientConfig.filesClientStreamingPort, this.filesClientConfig.filesClientHost);

			let responseBuffer = "";
			let timeout: NodeJS.Timeout;

			// таймаут для загрузки файла
			timeout = setTimeout(() => {
				socket.destroy();
				reject(new Error("Upload timeout"));
			}, 60000);

			// событие при соединении с файловым сервисом
			socket.on("connect", () => {
				console.log(`Connected to files service for upload ${filename}`);

				// может отправлять доп данные например опции для обработки файла
				// biome-ignore lint/style/useTemplate: <explanation>
				const header = JSON.stringify({ filename, size: fileBuffer.length }) + "\n";
				// отправляем заголовок с именем файла и размером
				socket.write(header);
				socket.end(fileBuffer);
			});

			// событие при получении данных от файлового сервиса
			socket.on("data", (data) => {
				responseBuffer += data.toString();
				console.log("Received data from server:", data.toString());

				// Проверяем, получили ли мы полный JSON ответ
				try {
					const response = JSON.parse(responseBuffer.trim());
					clearTimeout(timeout);

					if (response.success) {
						console.log("Upload successful, closing socket");
						// закрываем соединение с файловым сервисом
						socket.end();
						resolve(response);
					} else {
						socket.end();
						reject(new Error(response.error || "Upload failed"));
					}
				} catch (e) {
					// JSON еще не полный, ждем больше данных
					console.log("Waiting for more data, current buffer:", responseBuffer);
				}
			});

			// событие при ошибке соединения с файловым сервисом
			socket.on("error", (error) => {
				clearTimeout(timeout);
				console.error(`Socket error for upload ${filename}:`, error);
				reject(error);
			});

			// событие при закрытии соединения с файловым сервисом
			socket.on("close", () => {
				clearTimeout(timeout);
				console.log("Socket closed, response buffer:", responseBuffer);

				// Если мы дошли сюда без resolve, значит что-то пошло не так
				if (responseBuffer.trim()) {
					try {
						const response = JSON.parse(responseBuffer.trim());
						if (response.success) {
							resolve(response);
						} else {
							reject(new Error(response.error || "Upload failed"));
						}
					} catch (e) {
						reject(new Error(`Invalid response from files service: ${responseBuffer}`));
					}
				} else {
					reject(new Error("No response from files service"));
				}
			});
		});
	}
}
