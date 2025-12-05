# CloudCollab – ECE1779 Final Project

**Current Deployment**: https://cloudcollab-ufhp2.ondigitalocean.app/

CloudCollab is a lightweight, stateful, cloud-native ticket management and collaboration tool for small teams (student project groups, research labs, small startups). It provides a simple Kanban-style board backed by a PostgreSQL database, containerized with Docker, orchestrated with Kubernetes, and deployed on DigitalOcean with persistent storage and monitoring.

---

## Team Information

| Name         | Student ID  | Preferred Email                    |
| ------------ | ----------- | ---------------------------------- |
| Yu Zhang     | 1002935229  | yuqiu.zhang@mail.utoronto.ca      |
| Wenxuan Wang | 1004975927  | wenxuan.wang@mail.utoronto.ca     |
| Xiao Sun     | 1005975090  | xiao.sun@mail.utoronto.ca         |
| Xingda Jiang | 1007170525  | xingda.jiang@mail.utoronto.ca     |

## Motivation

### Problem

Small teams (course project groups, research labs, student clubs, small startups) often need a simple way to:

- Track tasks and bugs
- See who is working on what
- Coordinate deadlines and priorities
- Keep updates and discussion linked to specific work items

Existing tools like Jira or Asana are powerful but:

- Overkill for small teams
- Hard to self-host or customize
- Lock data into third-party SaaS
- Can be slow or complex to configure

### Why CloudCollab?

CloudCollab focuses on:

- **Simplicity** – a clean ticket board with just the core concepts: projects, tickets, assignees, statuses, and comments.
- **Stateful cloud deployment** – a real PostgreSQL database running in the cloud (DigitalOcean) with persistent storage, not a toy in-memory app.
- **Ownership and privacy** – teams can host it themselves, keep control of their data, and still enjoy modern DevOps practices (CI/CD, monitoring).
- **Alignment with course goals** – it showcases Docker, PostgreSQL, persistent storage, Kubernetes, and monitoring as required in ECE1779.

---


## Objectives

Our main objectives were:

1. **Build a usable ticket management application**  
   - Projects with boards of tickets  
   - Ticket statuses (To Do / In Progress / Done / Won’t Do)  
   - Assignees, descriptions, and comments

2. **Run it as a stateful cloud-native application**  
   - Use PostgreSQL as the primary data store  
   - Persist state across restarts and deployments using DigitalOcean volumes  
   - Avoid any in-memory or ephemeral storage for core data

3. **Use the required cloud technologies from the course**  
   - Containerize services using Docker  
   - Use Kubernetes (minikube locally, DigitalOcean Kubernetes in the cloud) for orchestration  
   - Deploy to DigitalOcean with persistent storage  
   - Integrate monitoring using DigitalOcean Monitoring plus Prometheus/Grafana dashboards

4. **Implement at least two advanced features**  
   - CI/CD pipeline with GitHub Actions  
   - Email notifications via SendGrid for ticket activity

5. **Demonstrate a clear DevOps workflow**  
   - From local development to cloud deployment  
   - With health checks, metrics, and reproducible setup


## Technical Stack

- **Languages & Frameworks**
  - Python (Django / DRF backend)
  - JavaScript / JSX (React frontend)
  - YAML (Kubernetes, GitHub Actions, Prometheus)
  - Dockerfiles for all main services

- **Backend**
  - Django + DRF with token-based authentication
  - PostgreSQL as the production database
  - SQLite only for local development when `USE_SQLITE=true`

- **Frontend**
  - React + Vite
  - React Query for API calls and caching
  - Simple, responsive UI for boards, tickets, and dashboards

- **Containerization & Local Dev**
  - Docker images for backend (`app_backend/Dockerfile`) and frontend (`frontend/Dockerfile`)
  - Optional Docker Compose setup for running app + database locally

- **State & Storage**
  - PostgreSQL for all relational data
  - Persistent storage via DigitalOcean managed PostgreSQL and underlying volumes

- **Deployment & Orchestration**
  - DigitalOcean as the cloud provider
  - Kubernetes (minikube for local, DigitalOcean Kubernetes in production)

- **Monitoring**
  - DigitalOcean Monitoring for cluster/node metrics
  - Prometheus scraping backend `/metrics`
  - Compatible with Grafana dashboards

---

## Features

### Core Technical Requirements

CloudCollab satisfies all core technical requirements:

- **Containerization & Local Development**
  - Backend and frontend both packaged as Docker images
  - Optional Docker Compose setup for local multi-container runs (app + database)

- **State Management**
  - Uses PostgreSQL as the main database
  - Production deployment relies on persistent storage so data survives restarts

- **Deployment Provider**
  - Deployed to **DigitalOcean**, using:
    - DigitalOcean Kubernetes
    - DigitalOcean managed PostgreSQL
    - DigitalOcean Monitoring

- **Orchestration**
  - **Kubernetes** used for both local (minikube) and cloud (DigitalOcean Kubernetes) environments
  - Deployments, Services, and PersistentVolumeClaims for the stateful backend

- **Monitoring and Observability**
  - DigitalOcean Monitoring enabled for system metrics
  - Backend exposes `/metrics` for Prometheus
  - Metrics can be visualized with Grafana dashboards

### Advanced Features

CloudCollab implements the following advanced features:

1. **CI/CD Pipeline**
   - GitHub Actions workflow builds backend and frontend Docker images
   - Images are pushed to GitHub Container Registry (GHCR)
   - Pipeline can be extended to apply Kubernetes manifests for automated deployment

2. **Email Notifications**
   - SendGrid integration using `SENDGRID_API_KEY`
   - Ticket assignees receive email notifications when new comments are added
   - Emails contain a short summary and a link back to the ticket

3. **Security Enhancements**
   - Token-based authentication for all backend APIs; unauthenticated requests are rejected
   - Per-user ownership enforced for tickets and comments to prevent cross-user data access
   - HTTPS termination via the DigitalOcean load balancer, encrypting client–cluster traffic
   - Sensitive values such as `DATABASE_URL` and `SENDGRID_API_KEY` stored in Kubernetes Secrets and injected as environment variables, not hard-coded


## User Guide

### Accessing the Application

- **Deployment URL**  
  `https://cloudcollab-ufhp2.ondigitalocean.app`

> If the deployment domain changes, update this URL in the README.

### Login

For demo purposes, local development uses seeded demo accounts. Example:

- `alice@example.com` / `password123`
- `bob@example.com` / `password456`

In production, accounts are created through the signup flow (if enabled) or by admin commands.

### Main User Flow

1. **Login**
   - Visit the deployment URL
   - Enter your email and password
   - On success, you are redirected to the dashboard

2. **Dashboard**
   - View an overview of projects and recent tickets
   - Navigate to a specific project board

3. **Projects**
   - List all projects you have access to
   - Select a project to open its ticket board

4. **Ticket Board**
   - View tickets grouped by status (To Do, In Progress, Done, Won’t Do)
   - Create a new ticket by filling in title, description, and assignee
   - Click a ticket to open the detail modal and edit fields
   - Change status via dropdown or drag-and-drop (depending on current UI state)

5. **Comments**
   - Open a ticket detail view
   - Add comments to discuss the task
   - If email is configured, assignees receive notifications when new comments are added

6. **Health & Metrics (for operators)**
   - `/healthz`: check if the backend is healthy
   - `/metrics`: view raw Prometheus metrics (typically scraped by Prometheus, not used directly by end users)

Make sure these images are committed to the repository so they render correctly on GitHub.


## Development Guide
**Deployment URL:** https://cloudcollab-ufhp2.ondigitalocean.app/

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


## Video Demo

The video demo (1–5 minutes) shows:

- Logging in and navigating the dashboard
- Creating and updating tickets on a project board
- Adding comments and triggering email notifications (if configured)
- Kubernetes workloads running on DigitalOcean
- Monitoring dashboards (DigitalOcean Monitoring and Grafana)

**Video URL:**  
`<PLACEHOLDER – insert YouTube / Google Drive / Dropbox link here>`


## Individual Contributions

- **Yu Zhang**

- **Wenxuan Wang**

- **Xiao Sun**

- **Xingda Jiang**
  - Frontend QOL update and bugfix
  - Kubernetes manifests and Kustomize overlays (`k8s/`)
  - Kubernetes deployment
  - CI/CD pipeline
  - Integration of Prometheus metrics and health endpoints


## Lessons Learned and Concluding Remarks

- **Kubernetes vs. simpler options.**  
  Kubernetes has more moving parts than Docker Compose or Swarm, but using minikube locally and DigitalOcean Kubernetes in production gave us hands-on experience with real-world orchestration patterns.

- **Instrumentation early is worth it.**  
  Adding `/metrics` and Prometheus middleware early made performance and debugging easier. We could see traffic patterns and spot issues instead of guessing.

- **Separation of concerns helps iteration.**  
  Keeping a clean separation between the REST API and the React frontend allowed each side to evolve independently with a stable contract.

- **CI/CD reduces friction.**  
  Automating image builds and pushes with GitHub Actions removed a lot of manual steps and made deployments more predictable.

- **Real-time features need full-stack support.**  
  We initially planned WebSocket-based real-time updates. The frontend hook is ready, but we decided to keep the backend HTTP-only for this iteration to ensure stability and on-time delivery. This showed us how important it is to balance scope and reliability.

Overall, CloudCollab delivers a focused, stateful, cloud-native application that meets all core technical requirements of ECE1779 and demonstrates two advanced features (CI/CD and email notifications), while solving a real collaboration problem faced by small teams.
