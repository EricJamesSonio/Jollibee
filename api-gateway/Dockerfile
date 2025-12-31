# Use lightweight Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /etc/nginx

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
