# Multi-stage build for production
FROM node:20-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
COPY frontend/yarn.lock* ./
RUN yarn install --production=false
COPY frontend/ ./
RUN yarn build

# Python backend stage
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Create startup script
RUN echo '#!/bin/bash\ncd /app/backend && uvicorn server:app --host 0.0.0.0 --port $PORT' > /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE $PORT

# Start command
CMD ["/app/start.sh"]