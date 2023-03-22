# Configuration

```bash
cp .env.test .env
# Edit .env file!
```

# Install dependencies & Build

```bash
yarn
yarn build
```

# Database migration

```bash
yarn build
yarn typeorm migration:generate -d dist/typeorm.config.js ./src/migrations/MyMigration
yarn build
yarn typeorm migration:run -d dist/typeorm.config.js
```

# Start

```bash
yarn start
yarn start:dev
```

# Run temporary test DB

```bash
docker run -d --rm -p 3306:3306 -e MYSQL_DATABASE=db1 -e MYSQL_ROOT_PASSWORD=abc123 mysql:8
```