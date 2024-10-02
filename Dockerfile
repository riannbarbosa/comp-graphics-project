FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY index.html /usr/share/nginx/html/index.html
COPY ./css/style.css /usr/share/nginx/html/css/style.css
COPY ./js/script.js /usr/share/nginx/html/js/script.js

EXPOSE 80