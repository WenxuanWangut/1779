#!/usr/bin/env bash
set -e
FRONTEND_ORIGIN="${FRONTEND_ORIGIN%/}"
BACKEND_ORIGIN="${BACKEND_ORIGIN%/}"
export FRONTEND_ORIGIN BACKEND_ORIGIN
envsubst '${FRONTEND_ORIGIN} ${BACKEND_ORIGIN}' < /etc/nginx/templates/nginx.conf.tmpl > /etc/nginx/nginx.conf
nginx -g 'daemon off;'