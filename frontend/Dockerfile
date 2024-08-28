# Base image with Node.js
FROM node:22.4-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm cache clean --force
RUN rm -rf node_modules
WORKDIR /app

# Copy and install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time arguments
ARG NEXT_PUBLIC_CONSTITUTION_TOKEN
ARG NEXT_PUBLIC_CONSTITUTION_URL
ARG NEXT_PUBLIC_CONSTITUTION_FILE_NAME

# Set these ARG values as ENV variables so they are available during build
ENV NEXT_PUBLIC_CONSTITUTION_TOKEN=${NEXT_PUBLIC_CONSTITUTION_TOKEN}
ENV NEXT_PUBLIC_CONSTITUTION_URL=${NEXT_PUBLIC_CONSTITUTION_URL}
ENV NEXT_PUBLIC_CONSTITUTION_FILE_NAME=${NEXT_PUBLIC_CONSTITUTION_FILE_NAME}

# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the project (ensure the env vars are available during the build)
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image
FROM base AS runner
WORKDIR /app

# Set runtime environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_CONSTITUTION_TOKEN=${NEXT_PUBLIC_CONSTITUTION_TOKEN}
ENV NEXT_PUBLIC_CONSTITUTION_URL=${NEXT_PUBLIC_CONSTITUTION_URL}
ENV NEXT_PUBLIC_CONSTITUTION_FILE_NAME=${NEXT_PUBLIC_CONSTITUTION_FILE_NAME}

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Add non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files and set permissions
COPY --from=builder /app/public ./public
RUN mkdir -p .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the necessary port
EXPOSE 3000

# Set the hostname to localhost
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
