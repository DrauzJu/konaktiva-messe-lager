FROM node:16 AS client-build
ENV YARN_CACHE_FOLDER="/root/.yarn"
RUN mkdir /workspace
COPY . /workspace
RUN --mount=type=cache,target=/root/.yarn \
  cd /workspace && yarn install --frozen-lockfile && \
  cd ./dto && yarn build && cd .. && \
  cd ./client && yarn build && cd ..

FROM node:16
ENV YARN_CACHE_FOLDER="/root/.yarn"
RUN mkdir /workspace
COPY --from=client-build /workspace/client/dist /workspace/client/dist
COPY ./server /workspace/server
COPY ./dto /workspace/dto
COPY ./package.json /workspace
RUN --mount=type=cache,target=/root/.yarn \
  cd /workspace && \
  yarn install --frozen-lockfile && yarn workspaces run build
WORKDIR /workspace/server
CMD ["yarn", "start"]
