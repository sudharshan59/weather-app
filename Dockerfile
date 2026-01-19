FROM nginx:alpine

# Remove the default Nginx index.html file first
RUN rm -rf /usr/share/nginx/weather-app.html/*

# Copy your files. 
# IMPORTANT: If your files are in a folder (e.g. 'src'), change '.' to './src'
COPY . /usr/share/nginx/weather-app.html

EXPOSE 80
