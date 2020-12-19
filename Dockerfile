FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm test

CMD ["npm","start"]
