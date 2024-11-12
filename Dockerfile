FROM nginx:1.21.0-alpine 
ENV NODE_ENV=production

COPY ngnix.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
