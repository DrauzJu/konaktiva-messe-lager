Requires: yarn, node

# Tech-Stack

- Server: Node + Typescript + NestJS
- Client: Typescript + Vue 3 + Vuetify Next
- Database: MySQL

# Install and build all

```bash
yarn install
yarn workspaces run build
```

See workspaces `dto`, `server` and `client` for details

# Read-Only Setup

In server `.env`, set `READ_ONLY_ACCESS=true`. This will block all requests with HTTP method not equals to `GET`.

Then, two instances can be deployed.
