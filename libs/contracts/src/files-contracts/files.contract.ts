import { UploadFileOutputDto } from "./output/upload-file.output.dto";

export interface IFilesClientService {
	uploadFile(file: any, folder: string, originalname: string): Promise<UploadFileOutputDto>;

	// uploadFiles(files: any[], path: string): Promise<Array<string>>;
}
