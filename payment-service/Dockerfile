FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV PORT=3004
EXPOSE ${PORT}
CMD ["node", "app.js"]
