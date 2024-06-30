FROM node:21 as builder

WORKDIR /app
COPY package*.json .
RUN npm install