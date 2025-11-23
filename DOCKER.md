# Docker гайд

## Запуск всего приложения (клиент + сервер):

После клонирования репозитория выполните:

```bash
docker-compose up --build
```

Приложение будет доступно по адресу: http://localhost:8080

API сервер: http://localhost:3333

### Остановка:

```bash
docker-compose down
```

### Пересборка:

```bash
docker-compose up --build --force-recreate
```

## Отдельный запуск компонентов

### Только сервер:

```bash
cd server
docker build -t avito-server .
docker run -p 3000:3000 avito-server
```

### Только клиент:

```bash
docker build -t avito-client .
docker run -p 80:80 avito-client
```

## Требования

- Docker версии 20.10+
- Docker Compose версии 2.0+

## Порты

- **80** - Frontend приложение
- **3000** - Backend API

## Troubleshooting

### Порт 8080 занят:

Измените порт в docker-compose.yml:

```yaml
client:
  ports:
    - '8080:80' # измените 8080 на любой другой
```

### Ошибки при сборке:

```bash
# очистите кэш
docker system prune -a

# перезапустите без кеша
docker-compose build --no-cache
```
