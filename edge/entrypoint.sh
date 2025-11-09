#!/usr/bin/env bash
set -e
envsubst '${FRONTEND_ORIGIN}' < /etc/nginx/templates/nginx.conf.tmpl > /etc/nginx/nginx.conf
nginx -g 'daemon off;'