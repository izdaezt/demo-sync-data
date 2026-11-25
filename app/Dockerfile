# ---- dev: hot reload (Vite + tsx watch) ----
FROM node:22-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 5173
CMD ["npm", "run", "dev"]

# ---- build: compile UI + server into dist/ ----
FROM dev AS build
RUN npm run build

# ---- prod: single deployable folder/image ----
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
