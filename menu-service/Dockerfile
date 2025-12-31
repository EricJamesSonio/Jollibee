# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Expose port from .env
ENV PORT=3001
EXPOSE ${PORT}

# Start app
CMD ["node", "app.js"]
