FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN mkdir tests

CMD ["node","exported_forensic_project.js","/usr/src/app/tests","activity.log"]

