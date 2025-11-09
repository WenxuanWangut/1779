#!/bin/sh
set -e
python manage.py migrate --noinput
python manage.py seed_data || true
exec gunicorn backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1