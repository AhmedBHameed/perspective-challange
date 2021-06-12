FROM node:12.16.3-slim

WORKDIR /usr/perspective/

COPY ./server/package*.json ./

RUN yarn

COPY ./server/ .

# RUN yarn build