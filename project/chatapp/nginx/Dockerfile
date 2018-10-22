
FROM node:10-alpine as builder

WORKDIR /home/node/app

COPY . ./

RUN npm install && npm run build

FROM nginx:1.15.5-alpine

LABEL maintainer="https://github.com/Vincit"

RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /home/node/app/dist /usr/share/nginx/html

