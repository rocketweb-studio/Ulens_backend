# Библиотеки (libs)

## Обзор

Библиотеки в проекте представляют собой переиспользуемые модули, которые могут быть использованы в различных микросервисах. Они находятся в директории `libs/` и включают в себя общие утилиты, константы и другие общие компоненты.

## Структура библиотек

```
libs/
├── tsconfig.libs.json          # Конфигурация сборки всех библиотек
├── constants/                  # Библиотека констант
│   ├── src/                   # Исходный код
│   └── tsconfig.lib.json      # Конфигурация сборки constants
└── utils/                     # Библиотека утилит
    ├── src/                   # Исходный код
    └── tsconfig.lib.json      # Конфигурация сборки utils
```

## Существующие библиотеки

### Constants (`libs/constants/`)
Содержит общие константы, используемые в различных микросервисах:
- Сообщения для микросервисов
- Названия микросервисов
- Общие перечисления

### Utils (`libs/utils/`)
Содержит общие утилиты:
- Валидация конфигурации
- Преобразование типов
- Общие функции

## Добавление новой библиотеки

### 1. Создание структуры
```bash
mkdir -p libs/new-library/src
```

### 2. Создание tsconfig.lib.json
Создайте файл `libs/new-library/tsconfig.lib.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "../../dist/libs/new-library"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

### 3. Добавление в tsconfig.libs.json
Добавьте ссылку на новую библиотеку в `libs/tsconfig.libs.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./constants/tsconfig.lib.json" },
    { "path": "./utils/tsconfig.lib.json" },
    { "path": "./new-library/tsconfig.lib.json" }
  ]
}
```

### 4. Добавление путей в корневой tsconfig.json
Добавьте путь для импорта в `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@libs/utils/*": ["libs/utils/src/*"],
      "@libs/constants/*": ["libs/constants/src/*"],
      "@libs/new-library/*": ["libs/new-library/src/*"]
    }
  },
  "references": [
    // ... существующие ссылки
    {
      "path": "./libs/new-library/tsconfig.lib.json"
    }
  ]
}
```

### 5. Создание index.ts
Создайте файл `libs/new-library/src/index.ts` для экспорта:
```typescript
export * from './your-module';
```

### 6. Сборка библиотеки
```bash
yarn build:libs
```



## Использование библиотек

### Настройка tsconfig.app в микросервисе
Пути для импорта(алиасы) настраиваются в корневом `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      // добавляем путь для новой библиотеки
      "@libs/new-library/*": ["../../libs/new-library/src/*"],
    }
  },
  "references": [
        // добавляем путь для новой библиотеки
        { "path": "../../libs/new-library/tsconfig.lib.json" },
    ],
}
```

### Импорт в микросервисах
```typescript
// Импорт из constants
import { AuthMessages } from '@libs/constants/auth-messages';
import { Microservice } from '@libs/constants/microservices';

// Импорт из utils
import { configValidationUtility } from '@libs/utils/env-validation.utility';

// Импорт из new-library
import { libraryFeature } from '@libs/new-library/library-feature';
```

## Рекомендации

### Структура библиотеки
- Используйте `src/` для исходного кода
- Создавайте `index.ts` для экспорта всех публичных API
- Следуйте принципу единственной ответственности

### Именование
- Используйте kebab-case для названий библиотек
- Используйте PascalCase для названий экспортируемых классов/интерфейсов
- Используйте camelCase для названий функций/переменных
