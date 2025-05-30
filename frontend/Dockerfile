FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm cache clean --force
RUN rm -rf node_modules
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm i; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disabled telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Define build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_USERSNAP_SPACE_API_KEY
ARG NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY
ARG NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS
ARG NEXT_PUBLIC_IS_MAINNET

# Set the environment variables inside the container
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_USERSNAP_SPACE_API_KEY=${NEXT_PUBLIC_USERSNAP_SPACE_API_KEY}
ENV NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY=${NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY}
ENV NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS=${NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS}
ENV NEXT_PUBLIC_IS_MAINNET=${NEXT_PUBLIC_IS_MAINNET}

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Disabled telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_USERSNAP_SPACE_API_KEY=${NEXT_PUBLIC_USERSNAP_SPACE_API_KEY}
ENV NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY=${NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY}
ENV NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS=${NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS}
ENV NEXT_PUBLIC_IS_MAINNET=${NEXT_PUBLIC_IS_MAINNET}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]