#!/bin/bash

# Load environment variables from .env file and run Django server

if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your SENDGRID_API_KEY"
    exit 1
fi

echo "✅ Loading environment variables from .env..."
export $(cat .env | grep -v '^#' | xargs)

# Verify API key is loaded
if [ -z "$SENDGRID_API_KEY" ]; then
    echo "⚠️  Warning: SENDGRID_API_KEY is not set!"
else
    echo "✅ SENDGRID_API_KEY loaded: ${SENDGRID_API_KEY:0:20}..."
fi

echo "✅ Starting Django server..."
python3 manage.py runserver

