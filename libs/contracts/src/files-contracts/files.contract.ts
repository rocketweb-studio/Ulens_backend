import { UploadFileOutputDto } from "./output/upload-file.output.dto";

export interface IFilesClientService {
	uploadFile(file: any, filename: string): Promise<UploadFileOutputDto>;

	uploadFiles(files: any[], path: string): Promise<Array<string>>;
}
