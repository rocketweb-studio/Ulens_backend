import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageConfig {
	s3Endpoint: string;
	s3AccessKeyId: string;
	s3SecretAccessKey: string;
	s3Bucket: string;
	s3Region: string;

	constructor(private configService: ConfigService) {
		this.s3Endpoint = this.configService.getOrThrow<string>("S3_ENDPOINT");
		this.s3AccessKeyId = this.configService.getOrThrow<string>("S3_ACCESS_KEY_ID");
		this.s3SecretAccessKey = this.configService.getOrThrow<string>("S3_SECRET_ACCESS_KEY");
		this.s3Bucket = this.configService.getOrThrow<string>("S3_BUCKET");
		this.s3Region = this.configService.getOrThrow<string>("S3_REGION");
	}
}
