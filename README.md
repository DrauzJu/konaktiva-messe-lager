<img src="./client/public/favicon.svg" width="256">

Packet storage management application for [konaktiva Darmstadt (student job fair)](https://www.konaktiva.tu-darmstadt.de/).

## Tech-Stack

Requires: yarn, node

- Server: Node + Typescript + NestJS
- Client: Typescript + Vue 3 + Vuetify Next
- Database: MySQL

## Install and build all

```bash
yarn install
yarn workspaces run build
```

See workspaces `dto`, `server` and `client` for details

## Start application

Start database before and configure server `.env` file (see [here](./server/README.md))!

```bash
yarn install
yarn workspaces run build

cd server
yarn start
```

Open http://localhost:3000

## Read-Only Setup

In server `.env`, set `READ_ONLY_ACCESS=true`. This will block all requests with HTTP method not equals to `GET`.

Then, two instances can be deployed.
