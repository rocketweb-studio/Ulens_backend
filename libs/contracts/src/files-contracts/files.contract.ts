import { UploadImageOutputDto } from "./output/upload-file.output.dto";

export interface IFilesClientService {
	uploadFile(file: any, folder: string, originalname: string): Promise<UploadImageOutputDto>;

	// uploadFiles(files: any[], path: string): Promise<Array<string>>;
}
