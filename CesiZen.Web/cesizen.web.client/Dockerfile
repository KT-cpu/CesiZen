FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginxinc/nginx-unprivileged:alpine AS final

# Bascule temporaire en root pour la mise à jour des paquets
USER root

# Mise à jour des paquets système (correctifs de sécurité)
RUN apk update && apk upgrade --no-cache

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier le template Nginx
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV NGINX_ENVSUBST_FILTER="API_URL|API_HOST"

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Retour en utilisateur non privilégié pour l'exécution
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]