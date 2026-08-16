FROM node:18-alpine

# Install build tools for C
RUN apk add --no-cache gcc libc-dev make

WORKDIR /app

# Copy the C scheduler source code
COPY scheduler ./scheduler/

# Build the C engine
WORKDIR /app/scheduler
RUN make

# Setup the Node backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/src ./src/

# Set env vars
ENV NODE_ENV=production
ENV PORT=3001
ENV SCHEDULER_ENGINE_PATH=/app/scheduler/scheduler_engine

EXPOSE 3001

CMD ["node", "src/server.js"]
