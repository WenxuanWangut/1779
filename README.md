# Project Setup and Running Guide

This is a full-stack ticket management application with a Django backend and React frontend.

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js** (for frontend - check `frontend/package.json` for version requirements)
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)

## Quick Start

### Option 1: Run Both Services Locally (Development)

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd app_backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Seed test data manually (otherwise it auto-seeds on startup)
python manage.py seed_data

# Start the Django development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

#### 2. Frontend Setup

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Run with Docker

If you prefer using Docker, you can build and run the containers:

#### Backend Docker

```bash
cd app_backend
docker build -t backend-app .
docker run -p 8000:8000 backend-app
```

#### Frontend Docker

```bash
cd frontend
docker build -t frontend-app .
docker run -p 3000:3000 frontend-app
```

## Configuration

### Backend Configuration

- Default port: `8000`
- Database: SQLite (file: `app_backend/db.sqlite3`)
- CORS: Enabled for all origins (development mode)
- Test data: Auto-seeded on server startup

### Frontend Configuration

- Default port: `3000`
- API Base URL: `http://localhost:8000` (can be overridden with `VITE_API_BASE` environment variable)
- Proxy: Frontend proxies `/api/*` requests to backend at `http://localhost:8000`

### Environment Variables

**Backend:**
- `DJANGO_DEBUG`: Set to `'true'` for debug mode (default: `'False'`)
- `DJANGO_ALLOWED_HOSTS`: Comma-separated list of allowed hosts (default: `'*'`)

**Frontend:**
- `VITE_API_BASE`: Backend API base URL (default: `'http://localhost:8000'`)

## Test Users

The application automatically seeds test users on startup:

- **Alice**: `alice@example.com` / `password123`
- **Bob**: `bob@example.com` / `password456`

## Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with one of the test users above
3. You can create projects, tickets, and comments

## API Testing

You can test the backend API directly using the test page:

```bash
# Open the test API page
cd app_backend
# On Windows:
start test_api.html
# On Mac/Linux:
open test_api.html
# Or use your browser to open the file directly
```

## Project Structure

```
.
├── app_backend/          # Django backend
│   ├── backend/         # Django project settings
│   ├── board/           # Main app with models, views, serializers
│   ├── manage.py        # Django management script
│   ├── requirements.txt # Python dependencies
│   └── README.md        # Backend-specific documentation
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── package.json    # Node dependencies
│   └── vite.config.js  # Vite configuration
└── k8s/                # Kubernetes deployment files
```

## Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change the port with `python manage.py runserver 8001`
- **Database errors**: Run `python manage.py migrate` to apply migrations
- **Module not found**: Ensure you've installed requirements with `pip install -r requirements.txt`

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically try the next available port
- **Cannot connect to backend**: 
  - Ensure backend is running on port 8000
  - Check that CORS is enabled in backend settings
  - Verify `VITE_API_BASE` environment variable if using custom backend URL
- **Module not found**: Run `npm install` in the frontend directory

### Connection Issues

- Ensure both servers are running
- Check that backend is accessible at `http://localhost:8000`
- Verify frontend can reach backend (check browser console for errors)

## Development Commands

### Backend

```bash
# Run migrations
python manage.py migrate

# Create migrations (after model changes)
python manage.py makemigrations

# Seed test data
python manage.py seed_data

# Run development server
python manage.py runserver
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Production Deployment

For production deployment, see the `k8s/` directory for Kubernetes configurations, or refer to the Dockerfiles in each service directory.

