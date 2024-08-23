# Use a base image with Node.js installed
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install nodemon

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Set the command to start the application
RUN npm start
