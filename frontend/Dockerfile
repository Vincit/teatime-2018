FROM node:10-alpine as build-deps
WORKDIR /home/node/app
COPY . ./
RUN npm install && npm run build

FROM nginx:1.15-alpine
COPY --from=build-deps /home/node/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]