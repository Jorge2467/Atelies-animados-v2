FROM node:20-alpine

WORKDIR /app

# Install dependencies required for Prisma + SQLite
RUN apk add --no-cache openssl

# Package files
COPY package*.json ./
RUN npm install

# Source files
COPY . .

# Generate Prisma Client & Build TypeScript
# Local databases shouldn't be copied from host; we init them via run script
RUN npx prisma generate
RUN npm run build

# Start Command ensuring migrations run before app boot
CMD ["sh", "-c", "npx prisma db push && node dist/prisma/seed.js && node dist/src/server.js"]
