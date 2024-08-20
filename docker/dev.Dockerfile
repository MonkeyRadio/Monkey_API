FROM node:22
WORKDIR /app
ENV PORT=3000
EXPOSE ${PORT}
CMD ["npm", "run", "start:dev"]
