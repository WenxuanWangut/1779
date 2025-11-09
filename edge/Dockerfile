# docker buildx build --platform linux/amd64 -t registry.digitalocean.com/cloudcollab/edge:latest -f Dockerfile . --push
FROM nginx:alpine
RUN apk add --no-cache bash gettext
ENV FRONTEND_ORIGIN=http://127.0.0.1:8080
ENV BACKEND_ORIGIN=http://127.0.0.1:8000
COPY nginx.conf.tmpl /etc/nginx/templates/nginx.conf.tmpl
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
CMD ["/entrypoint.sh"]