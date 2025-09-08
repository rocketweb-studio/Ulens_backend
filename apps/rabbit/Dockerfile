FROM rabbitmq:3.12-alpine

ARG port=5672
ARG service
ENV SERVICE=$service
ENV PORT=$port

ENV RABBITMQ_DEFAULT_USER=guest
ENV RABBITMQ_DEFAULT_PASS=guest
ENV RABBITMQ_DEFAULT_VHOST=/

RUN mkdir -p /etc/rabbitmq

# Генерируем конфиг с переменной порта
RUN echo "# RabbitMQ configuration" > /etc/rabbitmq/rabbitmq.conf && \
    echo "listeners.tcp.default = 0.0.0.0:${PORT}" >> /etc/rabbitmq/rabbitmq.conf && \
    echo "loopback_users = none" >> /etc/rabbitmq/rabbitmq.conf && \
    echo "log.console = true" >> /etc/rabbitmq/rabbitmq.conf

EXPOSE ${PORT}

CMD ["rabbitmq-server"]
