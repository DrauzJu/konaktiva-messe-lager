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
yarn typeorm migration:run
```

## Start

```bash
yarn start
yarn start:dev

# Client hot reload
cd client
yarn dev
```
