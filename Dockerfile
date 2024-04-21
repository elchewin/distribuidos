FROM node:17.8.0-alpine3.15

WORKDIR /app

RUN npm install express redis pg

COPY . .

CMD ["node", "tarea.js"]