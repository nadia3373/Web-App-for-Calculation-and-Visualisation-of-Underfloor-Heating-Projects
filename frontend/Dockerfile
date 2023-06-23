FROM node:current-slim AS build

WORKDIR /usr/src/app

COPY . .

RUN npm install && \
    npm run build

FROM nginx:stable-alpine-slim

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html