# Use the official Nginx image
FROM nginx:latest

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy password file for basic authentication
COPY .htpasswd /etc/nginx/.htpasswd