FROM node:16 as builder

WORKDIR /zoo

COPY ./server/package*.json ./

RUN yarn

COPY ./server .

RUN rm -f .env

RUN echo "APP_STATIC_VIDEO_PATH=/zoo-data" >> .env
RUN echo "APP_FAIR_API_URL=http://fairos:9090/v0/" >> .env

FROM node:16

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN mkdir /zoo-data

COPY --from=builder /zoo /zoo

WORKDIR /zoo/app

EXPOSE 8080

CMD ["node", "server.js"]
