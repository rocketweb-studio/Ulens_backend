import { validateSync } from 'class-validator';

//  используем для валидации конфигурации окружения
export const configValidationUtility = {
  //  валидация конфигурации окружения, если есть ошибки, то выбрасываем ошибку
  validateConfig: (config: any) => {
    const errors = validateSync(config);
    if (errors.length > 0) {
      const sortedMessages = errors.map(error => Object.values(error.constraints || {}).join(', ')).join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  },
  //  конвертация строки в булево значение, например: 'true' -> true, 'false' -> false
  convertToBoolean(value: string) {
    const trimmedValue = value?.trim();
    if (trimmedValue === 'true') return true;
    if (trimmedValue === '1') return true;
    if (trimmedValue === 'enabled') return true;
    if (trimmedValue === 'false') return false;
    if (trimmedValue === '0') return false;
    if (trimmedValue === 'disabled') return false;

    return null;
  },
  //  получение значений из enum, например: Environments -> ['development', 'staging', 'production', 'testing']
  getEnumValues<T extends Record<string, string>>(enumObj: T): string[] {
    return Object.values(enumObj);
  }
};
