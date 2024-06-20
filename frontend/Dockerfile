FROM node:alpine AS builder
ENV NODE_ENV=production

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .

RUN npm install --production=false
# Copy app files
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV $NEXT_PUBLIC_ENV

ENV NEXT_PUBLIC_CONSTITUTION_TOKEN="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"
ENV NEXT_PUBLIC_CONSTITUTION_URL="https://raw.githubusercontent.com/Thomas-Upfield/Constitution/main"
ENV NEXT_PUBLIC_CONSTITUTION_FILE_NAME="constitution-1.md"

# Build the app
RUN npm run build

EXPOSE 3000
CMD npm run start
