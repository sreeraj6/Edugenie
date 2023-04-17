FROM node:16.13.2

WORKDIR /app

COPY package*.json ./

RUN npm install express
COPY . .
EXPOSE 3000
CMD [ "npm install", "node ./bin/www"]

