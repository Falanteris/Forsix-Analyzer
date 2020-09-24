FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g forever@3.0.2

RUN mkdir log

CMD ["npm","start"]
