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
ENV NEXT_PUBLIC_CONSTITUTION_URL="https://raw.githubusercontent.com/Kristina2103/testMdx/main"
ENV NEXT_PUBLIC_CONSTITUTION_FILE_NAME="test.md"

# Build the app
RUN npm run build

EXPOSE 3000
CMD npm run start
