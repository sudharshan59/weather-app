FROM nginx:alpine

# 1. Clear default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# 2. Copy your files
COPY . /usr/share/nginx/html

EXPOSE 80
