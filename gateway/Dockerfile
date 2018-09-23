FROM node:10-alpine as build-deps
WORKDIR /home/node/app
COPY . ./
RUN npm install --ignore-scripts
CMD node proxy
