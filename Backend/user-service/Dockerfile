FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "pm2-runtime", "index.js" ]