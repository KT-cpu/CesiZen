# Image Node
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Construire l'application en production
RUN npm run build

# Image Nginx minimale pour servir les fichiers statiques

FROM nginx:alpine AS final

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage de build
COPY --from=build /app/dist /usr/share/nginx/html

# Port exposé
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]