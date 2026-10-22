# Render web service: builds the app and serves it with `vite preview`,
# which keeps the /api, /control/plate, /tunnel-source proxies and the navigation API.
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Render puts the .env secret file into the build context, so it is copied here too.
COPY . .
RUN npm run build

ENV PORT=8282
EXPOSE 8282
# Fall back to Render's runtime secret path if .env was not in the build context.
CMD ["sh", "-c", "[ -f .env ] || cp /etc/secrets/.env .env 2>/dev/null; exec npx vite preview --configLoader runner --host 0.0.0.0 --port ${PORT:-8282}"]
