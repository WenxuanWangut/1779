FROM nginx:1.25-alpine
RUN apk add --no-cache bash curl gettext
ENV PORT=8080 \
    SERVER_NAME=cloudcollab-ufhp2.ondigitalocean.app \
    FRONTEND_HOSTPORT=209.38.2.144:80 \
    PROXY_CONNECT_TIMEOUT=5s \
    PROXY_READ_TIMEOUT=30s
COPY nginx.conf.tmpl /etc/nginx/templates/nginx.conf.tmpl
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
CMD ["/entrypoint.sh"]