FROM node:20 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20
WORKDIR /app
ENV NODE_ENV=Production
ENV PORT=3000
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/schemas /app/schemas
COPY --from=builder /app/migrate.ts /app/migrate.ts
COPY --from=builder /app/constants /app/constants
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]