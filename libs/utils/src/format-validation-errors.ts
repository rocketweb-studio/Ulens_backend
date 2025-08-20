import { ValidationError } from "class-validator";

export type ErrorResponse = { message: string; field: string };

/**
 * Форматирует ошибки валидации в удобный для ответа формат
 * @param errors - массив ошибок валидации
 * @param errorMessage - опциональный массив для накопления ошибок (используется для рекурсии)
 * @returns массив отформатированных ошибок для ответа
 */

// Используется для форматирования ошибок валидации в удобный для ответа формат
// Пример использования:
// const errors = formatValidationErrors(errors);
// throw new BadRequestException(errors);
export const formatValidationErrors = (errors: ValidationError[], errorMessage?: any): ErrorResponse[] => {
	// Инициализируем массив для накопления ошибок
	const errorsForResponse = errorMessage || [];

	// Проходим по всем ошибкам валидации
	for (const error of errors) {
		// Если у ошибки нет ограничений, но есть дочерние ошибки - рекурсивно обрабатываем их
		if (!error?.constraints && error?.children?.length) {
			formatValidationErrors(error.children, errorsForResponse);
		}
		// Если у ошибки есть ограничения - обрабатываем их
		else if (error?.constraints) {
			// Получаем все ключи ограничений (например: 'isNotEmpty', 'isString', 'minLength')
			const constrainKeys = Object.keys(error.constraints);

			// Проходим по каждому ограничению
			for (const key of constrainKeys) {
				// Добавляем ошибку в массив ответа с сообщением и полем
				errorsForResponse.push({
					// Формируем сообщение: текст ошибки + полученное значение
					message: error.constraints[key] ? `${error.constraints[key]}; Received value: ${error?.value}` : "",
					// Указываем поле, в котором произошла ошибка
					field: error.property,
				});
			}
		}
	}

	// Возвращаем отформатированный массив ошибок
	return errorsForResponse;
};
