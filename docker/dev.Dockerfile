FROM node:20 as builder

WORKDIR /app
COPY package*.json .
RUN npm install