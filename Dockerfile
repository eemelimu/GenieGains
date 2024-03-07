FROM node:latest

WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8081
CMD ["run", "web"]
ENTRYPOINT [ "npm" ]

