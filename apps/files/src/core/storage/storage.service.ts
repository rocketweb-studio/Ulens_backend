import { Injectable } from "@nestjs/common";
import { StorageConfig } from "@files/core/storage/storage.confg";
import { DeleteObjectCommand, DeleteObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";

@Injectable()
export class StorageService {
	readonly client: S3Client;
	readonly bucket: string;

	constructor(private readonly storageConfig: StorageConfig) {
		this.client = new S3Client({
			region: this.storageConfig.s3Region,
			endpoint: this.storageConfig.s3Endpoint,
			credentials: {
				accessKeyId: this.storageConfig.s3AccessKeyId,
				secretAccessKey: this.storageConfig.s3SecretAccessKey,
			},
		});

		this.bucket = this.storageConfig.s3Bucket;
	}

	// Загрузка файла через Buffer (старый метод, сейчас не используется)
	// async uploadFile(buffer: Buffer, key: string, mimeType: string) {
	// 	try {
	// 		const command: PutObjectCommandInput = {
	// 			Bucket: this.bucket,
	// 			Key: key,
	// 			Body: buffer,
	// 			ContentType: mimeType,
	// 		};
	// 		await this.client.send(new PutObjectCommand(command));
	// 	} catch (error) {
	// 		throw new Error((error as Error).message);
	// 	}
	// }

	// Загрузка файла через поток
	async uploadFileStream(stream: NodeJS.ReadableStream, key: string, mimeType: string) {
		try {
			const pass = new PassThrough();
			stream.pipe(pass);

			const upload = new Upload({
				client: this.client,
				params: {
					Bucket: this.bucket,
					Key: key,
					Body: pass,
					ContentType: mimeType,
				},
				queueSize: 4, // параллельные чанки
				partSize: 5 * 1024 * 1024, // 5MB по дефолту
				leavePartsOnError: false,
			});

			await upload.done();
		} catch (error) {
			console.error("Upload stream error:", error);
			throw new Error((error as Error).message);
		}
	}

	async deleteFile(key: string) {
		try {
			const command: DeleteObjectCommandInput = {
				Bucket: this.bucket,
				Key: key,
			};
			await this.client.send(new DeleteObjectCommand(command));
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}
}
