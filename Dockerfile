# Use a base image with Node.js installed
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Clear out any existing node_modules
RUN rm -rf node_modules

# Install dependencies
RUN npm install

# Rebuild bcrypt to ensure compatibility with the Docker environment
RUN npm install bcrypt --save --build-from-source --napi-modules=bcrypt_lib

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Set the command to start the application
RUN node index.js
