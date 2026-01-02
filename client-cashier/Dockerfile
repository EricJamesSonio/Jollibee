# client-cashier/Dockerfile

# Step 1: Use the official Nginx image
FROM nginx:alpine

# Step 2: Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Step 3: Copy your client-cashier files into Nginx
COPY . /usr/share/nginx/html

# Step 4: Expose port 80
EXPOSE 80

# Step 5: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
