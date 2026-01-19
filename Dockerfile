FROM nginx:alpine

# 1. Clear the default Nginx folder (Standard path)
RUN rm -rf /usr/share/nginx/html/*

# 2. Copy your files to that STANDARD path
COPY . /usr/share/nginx/html

EXPOSE 80
