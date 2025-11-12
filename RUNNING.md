# How to Run CloudCollab Project

This guide covers multiple ways to run the project: local development, Docker, and Kubernetes.

## Prerequisites

- **For Local Development:**
  - Python 3.9+ and pip
  - Node.js 18+ and npm
  - Git

- **For Docker:**
  - Docker and Docker Compose

- **For Kubernetes:**
  - kubectl
  - Kubernetes cluster (or minikube/kind for local testing)

---

## Method 1: Local Development (Recommended for Development)

### Step 1: Start the Backend

1. Navigate to the backend directory:
```bash
cd app_backend
```

2. Create a virtual environment (optional but recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run database migrations:
```bash
python manage.py migrate
```

5. (Optional) Seed test data manually:
```bash
python manage.py seed_data
```
**Note:** Test data is automatically seeded when the server starts, so this step is optional.

6. Start the Django development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

**Test Users:**
- `alice@example.com` / `password123`
- `bob@example.com` / `password456`

### Step 2: Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

4. **Important:** The frontend expects the backend at `http://localhost:8000`. If your backend is running on a different port, set the environment variable:
```bash
# Windows (PowerShell)
$env:VITE_API_BASE="http://localhost:8000"
npm run dev

# Linux/Mac
VITE_API_BASE=http://localhost:8000 npm run dev
```

### Step 3: Access the Application

- Open your browser and go to `http://localhost:5173`
- Login with one of the test accounts:
  - Email: `alice@example.com`
  - Password: `password123`

---

## Method 2: Docker Development

### Option A: Run Backend and Frontend Separately

#### Backend Container

1. Build the backend image:
```bash
cd app_backend
docker build -t app-backend:latest .
```

2. Run the backend container:
```bash
docker run -d \
  --name app-backend \
  -p 8000:8000 \
  app-backend:latest
```

#### Frontend Container

1. Build the frontend image (set API base URL):
```bash
cd frontend
docker build --build-arg VITE_API_BASE=http://localhost:8000 -t app-frontend:latest .
```

2. Run the frontend container:
```bash
docker run -d \
  --name app-frontend \
  -p 80:80 \
  app-frontend:latest
```

**Note:** If running frontend in Docker, update `VITE_API_BASE` to point to your backend's accessible URL (e.g., `http://host.docker.internal:8000` for Docker Desktop).

### Option B: Docker Compose (Recommended)

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./app_backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DJANGO_DEBUG=True
      - DJANGO_ALLOWED_HOSTS=*
      - PORT=8000
    volumes:
      - ./app_backend/db.sqlite3:/app/db.sqlite3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE=http://localhost:8000
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE=http://localhost:8000
```

Then run:
```bash
docker-compose up --build
```

---

## Method 3: Kubernetes Deployment

### Prerequisites
- Kubernetes cluster running
- kubectl configured
- Images built and available (either in a registry or loaded locally)

### Step 1: Build and Load Images

```bash
# Build backend image
cd app_backend
docker build -t app-backend:local .

# Build frontend image
cd ../frontend
docker build --build-arg VITE_API_BASE=http://app-backend:8000 -t app-frontend:local .

# Load images into Kubernetes (for local clusters like minikube/kind)
minikube image load app-backend:local
minikube image load app-frontend:local

# OR push to a registry
docker tag app-backend:local your-registry/app-backend:latest
docker tag app-frontend:local your-registry/app-frontend:latest
docker push your-registry/app-backend:latest
docker push your-registry/app-frontend:latest
```

### Step 2: Deploy to Kubernetes

```bash
# Apply base resources
kubectl apply -k k8s/

# OR apply with overlay (dev)
kubectl apply -k k8s/overlays/dev/

# OR apply with overlay (prod)
kubectl apply -k k8s/overlays/prod/
```

### Step 3: Access the Application

For dev overlay (NodePort):
```bash
# Get the NodePort
kubectl get svc app-frontend -n default

# Access via NodePort (usually 30000-32767)
minikube service app-frontend
```

For prod overlay (LoadBalancer):
```bash
# Get the LoadBalancer IP
kubectl get svc app-frontend -n default

# Access via the external IP
```

---

## Troubleshooting

### Backend Issues

1. **Port already in use:**
   - Change the port: `python manage.py runserver 8001`
   - Update frontend `VITE_API_BASE` accordingly

2. **Database migration errors:**
   ```bash
   python manage.py migrate --run-syncdb
   ```

3. **Module not found errors:**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

1. **Cannot connect to backend:**
   - Verify backend is running: `curl http://localhost:8000/healthz`
   - Check CORS settings in `app_backend/backend/settings.py`
   - Verify `VITE_API_BASE` environment variable

2. **Proxy errors in Vite:**
   - The Vite proxy in `vite.config.js` points to port 3000, but backend runs on 8000
   - Either update the proxy target or use `VITE_API_BASE` environment variable

3. **Build errors:**
   - Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version: `node --version` (should be 18+)

### Docker Issues

1. **Container won't start:**
   - Check logs: `docker logs app-backend` or `docker logs app-frontend`
   - Verify ports aren't already in use

2. **Database not persisting:**
   - Ensure volumes are properly mounted
   - Check file permissions

### Kubernetes Issues

1. **Pods not starting:**
   - Check pod status: `kubectl get pods`
   - View pod logs: `kubectl logs <pod-name>`
   - Check events: `kubectl describe pod <pod-name>`

2. **Service not accessible:**
   - Verify service exists: `kubectl get svc`
   - Check service endpoints: `kubectl get endpoints`
   - For NodePort, ensure firewall allows the port range

---

## Environment Variables

### Backend
- `DJANGO_DEBUG`: Set to `True` for development, `False` for production
- `DJANGO_ALLOWED_HOSTS`: Comma-separated list of allowed hosts (default: `*`)
- `PORT`: Port to run the server on (default: `8000`)

### Frontend
- `VITE_API_BASE`: Backend API base URL (default: `http://localhost:8000`)

---

## Quick Start Commands

### Local Development (Fastest)
```bash
# Terminal 1 - Backend
cd app_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Docker (Isolated)
```bash
# Backend
cd app_backend
docker build -t app-backend:latest .
docker run -p 8000:8000 app-backend:latest

# Frontend (in another terminal)
cd frontend
docker build --build-arg VITE_API_BASE=http://localhost:8000 -t app-frontend:latest .
docker run -p 80:80 app-frontend:latest
```

---

## Testing the Application

1. **Health Check:**
   ```bash
   curl http://localhost:8000/healthz
   ```

2. **Login Test:**
   ```bash
   curl -X POST http://localhost:8000/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"password123"}'
   ```

3. **Frontend:**
   - Open `http://localhost:5173` (local) or `http://localhost` (Docker)
   - Login with test credentials
   - Create projects and tickets
   - Test drag-and-drop functionality

---

## Next Steps

- Review the API documentation in `app_backend/README.md`
- Check the proposal document for architecture details
- Explore the Kubernetes overlays for different deployment environments
- Set up CI/CD pipelines for automated deployments

