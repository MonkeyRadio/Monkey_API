FROM node:19-alpine as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY ./src ./src
COPY ./swagger ./swagger
RUN rm -rf ./dist
RUN npm run build
CMD [ "npm", "run", "test" ]