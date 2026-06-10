FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:alpine AS final

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier le template Nginx
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]