FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM httpd:2.4-alpine

COPY apache.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

RUN echo "Include conf/extra/httpd-vhosts.conf" >> /usr/local/apache2/conf/httpd.conf

COPY --from=build /app/dist/stockflow-web/browser /usr/local/apache2/htdocs/

EXPOSE 80