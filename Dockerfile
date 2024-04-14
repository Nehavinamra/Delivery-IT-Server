FROM node:20.11.0-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8081

CMD npm start