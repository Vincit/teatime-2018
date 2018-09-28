
FROM node:10-alpine

LABEL maintainer="https://github.com/Vincit"

WORKDIR /home/node/app

COPY . ./

RUN npm install --ignore-scripts

CMD [ "node", "mockserver" ]
