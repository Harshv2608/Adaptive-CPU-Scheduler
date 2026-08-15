# Note: This Dockerfile must be built from the root directory of the project.
# Command: docker build -t schedx-backend -f backend/Dockerfile .

# Build stage for C Engine
FROM debian:bullseye-slim AS c-builder

# Install GCC and Make
RUN apt-get update && apt-get install -y gcc make && rm -rf /var/lib/apt/lists/*

# Set working directory for scheduler
WORKDIR /app/scheduler

# Copy C engine source code
COPY ./scheduler/include ./include
COPY ./scheduler/src ./src
COPY ./scheduler/Makefile ./

# Compile the engine
RUN make

# Runtime stage for Node.js
FROM node:18-bullseye-slim

WORKDIR /app

# Copy the compiled C binary from the builder stage
COPY --from=c-builder /app/scheduler/scheduler_engine ./scheduler/scheduler_engine

# Setup the Node.js backend
WORKDIR /app/backend

# Copy package files and install dependencies
COPY ./backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY ./backend/src ./src

# Expose port and start
EXPOSE 3001
ENV PORT=3001
ENV SCHEDULER_ENGINE_PATH=/app/scheduler/scheduler_engine

CMD ["node", "src/server.js"]
