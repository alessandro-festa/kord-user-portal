# Multi-architecture build using SUSE BCI NodeJS 22
# Supports: linux/amd64, linux/arm64

# Build stage
FROM registry.suse.com/bci/nodejs:22 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY jsconfig.json ./
COPY next-env.d.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public

# Build the application
RUN npm run build

# Production stage
FROM registry.suse.com/bci/nodejs:22

WORKDIR /app

# Copy the standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs -s /bin/false nodejs

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "server.js"]
