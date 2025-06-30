FROM nginx:1.29.0-alpine-slim


COPY nginx.conf /etc/nginx/nginx.conf 
COPY /sayt /var/www/sayt


CMD [ "nginx", "-g", "daemon off;" ]

