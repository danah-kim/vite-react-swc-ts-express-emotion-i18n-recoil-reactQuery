FROM node:18.15.0

RUN mkdir -p /var/app
WORKDIR /var/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]
