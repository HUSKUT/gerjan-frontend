# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder
WORKDIR /home/node/app
COPY . .
RUN npm i
EXPOSE 8080
RUN npm run build

FROM nginx:1.24-alpine AS server
EXPOSE 8080
COPY --from=builder /home/node/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
