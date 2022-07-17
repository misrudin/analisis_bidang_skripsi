FROM node:alpine
WORKDIR /app
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
COPY package.json /app
COPY package-lock.json /app
RUN npm
EXPOSE 3000
COPY . /app
CMD ["yarn", "start"]