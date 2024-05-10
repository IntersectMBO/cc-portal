FROM node:alpine AS builder
ENV NODE_ENV=production

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .

RUN npm install --production
# Copy app files
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV $NEXT_PUBLIC_ENV

# Build the app
RUN npm run build --production


EXPOSE 3000
CMD npm run start
