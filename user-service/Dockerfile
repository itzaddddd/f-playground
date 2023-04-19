# Base image
FROM node:14-alpine

# Set up working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
