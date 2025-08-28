import { Injectable } from "@nestjs/common";
import { StorageConfig } from "@files/core/storage/storage.confg";
import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";

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

	async uploadFile(buffer: Buffer, key: string, mimeType: string) {
		try {
			const command: PutObjectCommandInput = {
				Bucket: this.bucket,
				Key: key,
				Body: buffer,
				ContentType: mimeType,
			};
			await this.client.send(new PutObjectCommand(command));
		} catch (error) {
			throw new Error(error);
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
			throw new Error(error);
		}
	}
}
