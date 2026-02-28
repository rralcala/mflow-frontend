# Stage 1: Build the React admin application
# Use a specific Node.js version as the base image for the build stage
FROM node:20-alpine AS build 

# Set the working directory inside the container
WORKDIR /app 

# Copy package.json and package-lock.json to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the react-admin application for production
RUN npm run build 

# Stage 2: Serve the application with Nginx
# Use a lightweight Nginx image as the base image for the production stage
FROM nginx:alpine 

# Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the 'build' stage to the Nginx static file directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the host machine
EXPOSE 80

# Command to start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
