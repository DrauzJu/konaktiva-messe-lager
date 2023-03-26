FROM node:16 AS client-build
RUN mkdir /workspace
COPY . /workspace
RUN cd /workspace/client && yarn install --frozen-lockfile && yarn build

FROM node:16
RUN mkdir /workspace
COPY --from=client-build /workspace/client/dist /workspace/client/dist
COPY ./server /workspace/server
COPY ./dto /workspace/dto
COPY ./package.json /workspace
RUN cd /workspace && yarn install --frozen-lockfile && yarn workspaces run build
WORKDIR /workspace/server
CMD ["yarn", "start"]
