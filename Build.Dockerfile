FROM node:18.12.1-alpine AS build

WORKDIR /opt/app

RUN npm config set legacy-peer-deps true
RUN apk update && apk upgrade && apk add --no-cache git bash

COPY . .

RUN npm install \
 && npm run build

FROM nginx:alpine

COPY --from=0 /opt/app/build/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]