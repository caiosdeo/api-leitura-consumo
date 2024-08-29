# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/index.js"]
