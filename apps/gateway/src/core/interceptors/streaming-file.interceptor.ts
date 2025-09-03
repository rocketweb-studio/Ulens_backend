import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { BadRequestRpcException } from "@libs/exeption/rpc-exeption";

@Injectable()
export class StreamingFileInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();

		// Не используем multer для буферизации файла
		// Просто проверяем Content-Type
		const contentType = request.headers["content-type"];
		if (!contentType || !contentType.includes("multipart/form-data")) {
			throw new BadRequestRpcException("Invalid content type", "content-type");
		}

		return next.handle();
	}
}
