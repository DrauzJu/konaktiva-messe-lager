## Configuration

```bash
cp .env.test .env
# Edit .env file!
```

## Install dependencies & Build

```bash
# Server
yarn install
yarn build

# Client
cd client
yarn install
yarn build
```

## Database migration

```bash
yarn build
yarn typeorm migration:generate -d dist/typeorm.config.js ./src/migrations/MyMigration
yarn build
yarn typeorm migration:run -d dist/typeorm.config.js
```

## Start

```bash
yarn start
yarn start:dev

# Client hot reload
cd client
yarn dev
```

## Run temporary test DB

```bash
docker run --rm -p 3306:3306 -e MYSQL_DATABASE=db1 -e MYSQL_ROOT_PASSWORD=abc123 mysql:8
```