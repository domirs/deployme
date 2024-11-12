FROM nginx:1.21.0-alpine 

COPY ngnix.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html

RUN chown -R 1001:0 /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
  chown -R 1001:0 /var/cache/nginx && \
  chown -R 1001:0 /var/log/nginx && \
  chown -R 1001:0 /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
  chown -R 1001:0 /var/run/nginx.pid

USER 1001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
