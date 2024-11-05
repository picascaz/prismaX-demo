# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the entire project
COPY . .

# Build the Next.js project
RUN npm run build

# Stage 2: Setup the production environment
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Expose port 8080, as required by Cloud Run
EXPOSE 8080

# Command to start the Next.js application (using Next.js start for production)
CMD ["npm", "start"]
