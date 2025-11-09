#!/bin/sh
set -e
envsubst '${PORT} ${SERVER_NAME} ${FRONTEND_HOSTPORT} ${PROXY_CONNECT_TIMEOUT} ${PROXY_READ_TIMEOUT}' \
  < /etc/nginx/templates/nginx.conf.tmpl > /etc/nginx/nginx.conf
nginx -g 'daemon off;'