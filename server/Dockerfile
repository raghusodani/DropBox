# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the API port
EXPOSE 5001

# Default command
CMD ["npm", "start"]
