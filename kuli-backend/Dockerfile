# ─── Stage 1: Build ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (for Docker layer caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for building)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the NestJS production bundle
RUN npm run build

# ─── Stage 2: Production ────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Generate Prisma Client in production image
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the production server
CMD ["node", "dist/main.js"]
