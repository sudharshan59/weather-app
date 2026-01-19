# Use Nginx (Lightweight Web Server)
FROM nginx:alpine

# Copy your HTML files to the server
COPY . /usr/share/nginx/html

# Open port 80
EXPOSE 80
