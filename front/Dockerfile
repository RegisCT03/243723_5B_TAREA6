FROM node:20-alpine
WORKDIR /app
COPY front/package*.json ./
RUN npm install && npm install pg
COPY . .
WORKDIR /app/front
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]