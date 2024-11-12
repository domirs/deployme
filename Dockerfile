FROM registry.access.redhat.com/ubi8/nginx-126

# Add application sources
ADD nginx.conf "${NGINX_CONF_PATH}"
ADD dist/* .

# Run script uses standard ways to run the application
CMD nginx -g "daemon off;"
