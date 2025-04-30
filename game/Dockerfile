FROM node:19.4-slim

WORKDIR /game

COPY . .

# Install http-server globally (avoid permission issues with local .bin)
RUN npm install -g http-server

EXPOSE 8080

CMD ["http-server", "-c-1"]
