import { ValidationError, ValidationPipe } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";

// для чата для валидации входящих данных
@Injectable()
export class WsValidationPipe extends ValidationPipe {
	createExceptionFactory() {
		return (validationError: ValidationError[]) => {
			if (this.isDetailedOutputDisabled) {
				return new WsException("Bad request");
			}

			const errors = this.flattenValidationErrors(validationError);

			return new WsException(errors);
		};
	}
}
