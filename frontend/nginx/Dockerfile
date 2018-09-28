
FROM node:10-alpine as build-deps
WORKDIR /home/node/app
COPY . ./
RUN npm install && npm run build

FROM nginx:1.15.3-alpine

LABEL maintainer="https://github.com/Vincit"

COPY run.sh /run.sh
COPY nginx.conf.tmpl /etc/nginx/nginx.conf.tmpl
COPY --from=build-deps /home/node/app/dist /usr/share/nginx/html

RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/*

CMD [ "/run.sh" ]
