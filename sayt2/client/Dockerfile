FROM node:18-alpine

COPY package.json   .
COPY package-lock.json   .

RUN npm install

COPY . .

RUN  npm run build

RUN npm install -g serve
 

EXPOSE 3000

CMD ["serve", "-s" ,"build"]