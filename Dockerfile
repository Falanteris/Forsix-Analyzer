FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN mkdir log

CMD ["npm","start"]
