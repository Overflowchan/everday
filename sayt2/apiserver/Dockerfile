FROM node:18-alpine

COPY package.json   .
COPY package-lock.json   .

RUN npm ci 

COPY . .

EXPOSE 8010

CMD ["node", "index.js"]