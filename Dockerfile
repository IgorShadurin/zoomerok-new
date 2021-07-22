FROM node:16 as builder

WORKDIR /zoo

COPY ./server/package*.json ./

RUN yarn

COPY ./server .

RUN rm .env

RUN echo "APP_STATIC_VIDEO_PATH=/zoo-data" >> .env
RUN echo "APP_FAIR_API_URL=http://fairos:9090/v0/" >> .env

FROM node:16

RUN mkdir /zoo-data

COPY --from=builder /zoo /zoo

WORKDIR /zoo/app

EXPOSE 8080

CMD ["node", "server.js"]
