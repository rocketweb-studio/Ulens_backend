# Используем официальный образ Redis
FROM redis:7.2-alpine

# Переменные окружения (оставляем для совместимости с системой)
ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port

# Создаем директорию для конфигурации Redis
RUN mkdir -p /usr/local/etc/redis

# Создаем пользователя redis (если не существует)
RUN addgroup -g 999 redis && adduser -D -u 999 -G redis redis || true

# Устанавливаем владельца для директории
RUN chown -R redis:redis /usr/local/etc/redis /data

# Переключаемся на пользователя redis
USER redis

# ИСПРАВЛЕНО: Не создаем конфигурацию с портом во время сборки
RUN echo "# Redis configuration" > /usr/local/etc/redis/redis.conf && \
    echo "bind 0.0.0.0" >> /usr/local/etc/redis/redis.conf && \
    echo "dir /data" >> /usr/local/etc/redis/redis.conf && \
    echo "save 900 1" >> /usr/local/etc/redis/redis.conf && \
    echo "save 300 10" >> /usr/local/etc/redis/redis.conf && \
    echo "save 60 10000" >> /usr/local/etc/redis/redis.conf

# Открываем порт (используем ARG для времени сборки)
EXPOSE ${port}

# КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Используем переменную окружения в CMD
CMD ["sh", "-c", "redis-server --bind 0.0.0.0 --port ${PORT:-6379} --dir /data --save '900 1' --save '300 10' --save '60 10000'"]