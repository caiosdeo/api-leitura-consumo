# Dockerfile.dev
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the app with TypeScript compilation
CMD ["npm", "run", "dev"]
