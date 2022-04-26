FROM node:14

LABEL application="docker-nest"

WORKDIR /app

COPY .  /app

RUN yarn --no-cache

CMD ["yarn","start"]