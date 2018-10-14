
FROM node:10-alpine

LABEL maintainer="https://github.com/Vincit"

EXPOSE 3000

WORKDIR /home/node/app

COPY . ./

RUN npm install --ignore-scripts

USER node

CMD [ "node", "gateway" ]

