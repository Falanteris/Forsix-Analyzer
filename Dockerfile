FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g forever

RUN mkdir log

CMD ["npm","start"]
