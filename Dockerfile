# Stage 1: Build the App
FROM node:18-alpine as builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the built files from the previous stage
# NOTE: If using Vite, change '/app/build' to '/app/dist'
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
