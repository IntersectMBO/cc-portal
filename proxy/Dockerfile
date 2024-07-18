# Use the official Nginx image
FROM nginx:latest

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy password file for basic authentication
COPY .htpasswd /etc/nginx/.htpasswd

# Copy cert.pem
COPY cert.pem /etc/nginx/ssl

# Copy key.pem
COPY key.pem /etc/nginx/ssl