# Используем официальный образ RabbitMQ
FROM rabbitmq:3.12-alpine

# Переменные окружения (оставляем для совместимости с системой)
ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port

# Устанавливаем стандартные переменные RabbitMQ
ENV RABBITMQ_DEFAULT_USER=admin
ENV RABBITMQ_DEFAULT_PASS=admin123
ENV RABBITMQ_DEFAULT_VHOST=/

# Создаем директорию для конфигурации RabbitMQ
RUN mkdir -p /etc/rabbitmq

# Создаем базовую конфигурацию RabbitMQ (без management plugin)
RUN echo "# RabbitMQ configuration" > /etc/rabbitmq/rabbitmq.conf && \
    echo "listeners.tcp.default = 0.0.0.0:5672" >> /etc/rabbitmq/rabbitmq.conf && \
    echo "loopback_users = none" >> /etc/rabbitmq/rabbitmq.conf && \
    echo "log.console = true" >> /etc/rabbitmq/rabbitmq.conf

# Открываем только основной порт
EXPOSE ${port}

# Создаем скрипт запуска который использует переменную PORT
RUN echo '#!/bin/sh' > /start-rabbitmq.sh && \
    echo 'export RABBITMQ_NODE_PORT=${PORT:-5672}' >> /start-rabbitmq.sh && \
    echo 'echo "Starting RabbitMQ on port $RABBITMQ_NODE_PORT"' >> /start-rabbitmq.sh && \
    echo 'rabbitmq-server' >> /start-rabbitmq.sh && \
    chmod +x /start-rabbitmq.sh

# Запускаем RabbitMQ с кастомным портом
CMD ["sh", "-c", "export RABBITMQ_NODE_PORT=${PORT:-5672} && echo 'Starting RabbitMQ on port '$RABBITMQ_NODE_PORT && rabbitmq-server"]