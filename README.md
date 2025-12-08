# CloudCollab – ECE1779 Final Project Report

**Demo Video**: https://youtu.be/iWGYpR4Y3m8

**Live Deployment**: https://cloudcollab-ufhp2.ondigitalocean.app/
---


## Team Information

| Name         | Student ID  | Preferred Email                     | GitHub ID        |
| ------------ | ----------- | ----------------------------------- | ---------------- |
| Yu Zhang     | 1002935229  | yuqiu.zhang@mail.utoronto.ca       | _to be filled_   |
| Wenxuan Wang | 1004975927  | wenxuanrz.wang@mail.utoronto.ca    | WenxuanWangut    |
| Xiao Sun     | 1005975090  | xiao.sun@mail.utoronto.ca          | _to be filled_   |
| Xingda Jiang | 1007170525  | xingda.jiang@mail.utoronto.ca      | _to be filled_   |

---

## Motivation

### The Problem

Small teams—whether they are course project groups, research labs, student clubs, or small startups—often struggle to manage tasks and coordinate work effectively. These teams typically rely on:

- **Spreadsheets** for task tracking, which lack real-time collaboration and become unwieldy as projects grow
- **Chat tools** like Slack or Discord, where task information gets lost in conversation threads
- **Free tiers of enterprise platforms** like Jira, Trello, or Asana, which are:
  - **Overkill** for small teams with limited needs
  - **Expensive** when scaling beyond free tiers
  - **Hard to self-host** or customize for specific requirements
  - **Vendor-locked**, preventing teams from maintaining full control over their data
  - **Complex** to configure and maintain, requiring significant time investment

These teams need a simple, reliable, and self-deployable solution that enables transparent task coordination while preserving full control over their data and maintaining privacy.

### Why CloudCollab?

CloudCollab addresses these pain points by providing:

- **Simplicity**: A clean, focused interface with core concepts—projects, tickets, assignees, statuses, and comments—without overwhelming features
- **Stateful Cloud Deployment**: A real PostgreSQL database running in the cloud (DigitalOcean) with persistent storage, ensuring data durability across restarts and deployments
- **Ownership and Privacy**: Teams can host the application themselves, maintain full control over their data, and still benefit from modern DevOps practices (CI/CD, monitoring)
- **Alignment with Course Goals**: The project showcases Docker containerization, PostgreSQL persistence, Kubernetes orchestration, and monitoring—all core requirements of ECE1779

### Target Users

- **University project teams** needing transparent task coordination and progress tracking
- **Startups or small organizations** requiring cost-efficient workflow tools without vendor lock-in
- **Open-source contributors** seeking customizable and privacy-preserving collaboration platforms
- **Research labs** needing lightweight project management without enterprise complexity

---

## Objectives

Our project objectives were designed to meet both course requirements and real-world needs:

### 1. Build a Usable Ticket Management Application

We aimed to create a functional, user-friendly application with:
- **Projects**: Organizational containers for related tickets
- **Ticket Board**: Kanban-style visualization with status columns (To Do, In Progress, Done, Won't Do)
- **Ticket Management**: Create, read, update, and delete tickets with rich metadata
- **Assignees**: Link tickets to team members for clear ownership
- **Comments**: Enable discussion and updates directly on tickets
- **User Authentication**: Secure access with token-based authentication

### 2. Run as a Stateful Cloud-Native Application

Critical to our design was ensuring true statefulness:
- **PostgreSQL as Primary Data Store**: All relational data persisted in PostgreSQL
- **Persistent Storage**: Data survives pod restarts, deployments, and cluster updates using DigitalOcean managed PostgreSQL
- **No Ephemeral Storage**: Avoided in-memory or temporary storage for core application data
- **Data Durability**: Implemented proper database migrations and backup strategies

### 3. Use Required Cloud Technologies

We integrated all core technologies from the course:
- **Containerization**: Docker images for backend and frontend services
- **Orchestration**: Kubernetes (minikube for local development, DigitalOcean Kubernetes for production)
- **Cloud Provider**: DigitalOcean for hosting, storage, and managed services
- **Monitoring**: DigitalOcean Monitoring plus Prometheus metrics scraping
- **Persistent Storage**: DigitalOcean managed PostgreSQL with automatic backups

### 4. Implement Advanced Features

We implemented two advanced features beyond core requirements:
- **CI/CD Pipeline**: GitHub Actions workflow that automatically builds Docker images and pushes them to GitHub Container Registry (GHCR)
- **Email Notifications**: SendGrid integration that sends email notifications to ticket assignees when new comments are added

### 5. Demonstrate DevOps Workflow

We established a complete development-to-production pipeline:
- **Local Development**: Clear setup instructions for running services locally
- **Containerization**: Docker images for consistent environments
- **Orchestration**: Kubernetes manifests with Kustomize overlays for environment-specific configurations
- **Health Checks**: Readiness and liveness probes for reliable deployments
- **Metrics**: Prometheus-compatible metrics endpoint for observability
- **Documentation**: Comprehensive guides for setup, deployment, and troubleshooting

---

## Technical Stack

### Languages & Frameworks

- **Python 3.12**: Backend development
- **Django 4.2+**: Web framework for rapid development
- **Django REST Framework (DRF)**: Building RESTful APIs
- **JavaScript/JSX**: Frontend development
- **React 18.3**: Component-based UI framework
- **Vite 5.4**: Fast build tool and development server
- **YAML**: Configuration for Kubernetes, GitHub Actions, and Prometheus

### Backend Architecture

- **Framework**: Django + Django REST Framework
- **Authentication**: Custom token-based authentication system (in-memory tokens for simplicity)
- **Database**: 
  - PostgreSQL (production and cloud deployment)
  - SQLite (local development when `USE_SQLITE=true`)
- **API Style**: RESTful API with JSON responses
- **Server**: Gunicorn for production WSGI server
- **Email**: SendGrid API for email notifications

### Frontend Architecture

- **Framework**: React with functional components and hooks
- **State Management**: React Query (TanStack Query) for server state and caching
- **Routing**: React Router DOM for client-side routing
- **UI Components**: Atlaskit Design System for consistent, accessible components
- **Styling**: CSS modules and inline styles with global CSS
- **Build Tool**: Vite for fast development and optimized production builds
- **HTTP Client**: Axios with interceptors for authentication and error handling

### Containerization

- **Backend Dockerfile**: Multi-stage build with Python 3.12-slim base image
- **Frontend Dockerfile**: Multi-stage build with Node.js 22-alpine for build, nginx:alpine for serving
- **Edge Service**: Nginx reverse proxy with environment variable templating
- **Image Registry**: GitHub Container Registry (GHCR) for storing built images

### State & Storage

- **Database**: PostgreSQL 14+ (DigitalOcean Managed Database)
- **Persistence**: DigitalOcean managed PostgreSQL with automatic backups
- **Migrations**: Django migrations for schema management
- **Data Seeding**: Automatic test data seeding on application startup

### Deployment & Orchestration

- **Cloud Provider**: DigitalOcean
- **Orchestration**: Kubernetes (DigitalOcean Kubernetes Service)
- **Local Development**: minikube for local Kubernetes testing
- **Configuration Management**: Kustomize for environment-specific overlays (dev/prod)
- **Services**: 
  - Backend: ClusterIP service with health check annotations
  - Frontend: LoadBalancer service for external access
- **Secrets Management**: Kubernetes Secrets for sensitive configuration (DATABASE_URL, SENDGRID_API_KEY)

### Monitoring & Observability

- **Health Endpoints**: `/healthz` for basic health checks
- **Metrics Endpoint**: `/metrics` exposing Prometheus-compatible metrics
- **Metrics Middleware**: Custom Django middleware tracking HTTP request counts and latencies
- **Platform Monitoring**: DigitalOcean Monitoring for cluster and node metrics
- **Prometheus**: Configured to scrape backend metrics endpoint
- **Grafana**: Compatible dashboard setup for visualizing metrics

### Development Tools

- **Version Control**: Git with GitHub
- **CI/CD**: GitHub Actions for automated builds and deployments
- **Package Management**: 
  - pip for Python dependencies
  - npm for Node.js dependencies
- **Code Quality**: ESLint for JavaScript/JSX linting

---

## Features

### Core Technical Requirements

CloudCollab satisfies all core technical requirements for ECE1779:

#### Containerization & Local Development

- **Docker Images**: Both backend and frontend are packaged as Docker images with optimized multi-stage builds
- **Dockerfiles**: Separate Dockerfiles for each service with production-ready configurations
- **Local Development**: Clear instructions for running services locally with or without Docker
- **Environment Variables**: Proper configuration management through environment variables

#### State Management

- **PostgreSQL Database**: All application data stored in PostgreSQL
- **Persistent Storage**: Production deployment uses DigitalOcean managed PostgreSQL, ensuring data survives pod restarts and deployments
- **Database Migrations**: Django migrations manage schema changes version-controlled and applied automatically
- **Data Seeding**: Automatic seeding of test data for development and demonstration

#### Deployment Provider

- **DigitalOcean**: All services deployed on DigitalOcean infrastructure
  - DigitalOcean Kubernetes Service for orchestration
  - DigitalOcean Managed PostgreSQL for database
  - DigitalOcean Load Balancer for external access
  - DigitalOcean Monitoring for system metrics

#### Orchestration

- **Kubernetes**: Full Kubernetes deployment with:
  - Deployments for backend and frontend services
  - Services for internal and external communication
  - Health checks (readiness, liveness, startup probes)
  - Resource limits and requests
  - Environment-specific configurations via Kustomize overlays
- **Local Testing**: minikube support for local Kubernetes development

#### Monitoring and Observability

- **Health Endpoints**: `/healthz` endpoint for basic health checks used by Kubernetes probes
- **Prometheus Metrics**: `/metrics` endpoint exposing HTTP request counts and latencies
- **Metrics Middleware**: Custom Django middleware tracking:
  - Total HTTP requests by method, path, and status code
  - Request duration histograms by method and path
- **Platform Integration**: DigitalOcean Monitoring provides cluster and node-level metrics
- **Grafana Compatibility**: Metrics format compatible with Grafana dashboards

### Advanced Features

#### 1. CI/CD Pipeline

**Implementation**: GitHub Actions workflow that automates the build and deployment process.

**Features**:
- **Automated Builds**: Triggers on pushes to main branch and pull requests
- **Multi-Architecture Support**: Builds Docker images for multiple platforms
- **Image Registry**: Pushes built images to GitHub Container Registry (GHCR)
- **Caching**: Docker layer caching for faster builds
- **Extensibility**: Pipeline can be extended to automatically apply Kubernetes manifests

**Workflow**:
1. Code is pushed to repository
2. GitHub Actions triggers build workflow
3. Docker images are built for backend and frontend
4. Images are tagged and pushed to GHCR
5. (Optional) Kubernetes manifests are applied automatically

**Benefits**:
- Reduces manual deployment steps
- Ensures consistent builds across environments
- Enables rapid iteration and deployment
- Provides audit trail of all deployments

#### 2. Email Notifications

**Implementation**: SendGrid integration for sending email notifications.

**Features**:
- **Comment Notifications**: Ticket assignees receive email notifications when new comments are added to their assigned tickets
- **Email Content**: Includes comment author, ticket name, and truncated comment content (first 10 words)
- **Configuration**: API key stored securely in Kubernetes Secrets
- **Error Handling**: Graceful degradation if SendGrid API key is not configured
- **Logging**: Comprehensive logging for email send attempts and failures

**User Experience**:
- Assignees are notified immediately when someone comments on their tickets
- Emails include context (ticket name, comment preview) for quick understanding
- Non-blocking: Application continues to function even if email sending fails

#### 3. Security Enhancements

**Authentication**:
- Token-based authentication for all backend API endpoints
- Unauthenticated requests are rejected with 401 status
- Tokens stored securely (in-memory for simplicity, can be extended to database storage)

**Authorization**:
- Per-user ownership enforced for projects (only creators can update/delete)
- Per-user ownership enforced for comments (only commentors can update/delete their own comments)
- Prevents cross-user data access

**Infrastructure Security**:
- HTTPS termination via DigitalOcean Load Balancer
- Sensitive values (DATABASE_URL, SENDGRID_API_KEY) stored in Kubernetes Secrets
- No hard-coded secrets in code or configuration files
- Environment variable injection at runtime

### Application Features

#### User Management

- **User Registration**: Signup with email, password, name, and signup token
- **User Login**: Email and password authentication
- **User Search**: Search for users/assignees by name prefix
- **User Profiles**: Display user information (name, email) throughout the application

#### Project Management

- **Create Projects**: Users can create new projects
- **List Projects**: View all projects the user has access to
- **Project Details**: View project information including creator
- **Update Projects**: Project creators can update project names
- **Delete Projects**: Project creators can delete projects (cascades to tickets)

#### Ticket Management

- **Create Tickets**: Create tickets with name, description, status, project, and assignee
- **List Tickets**: View all tickets grouped by status (To Do, In Progress, Done, Won't Do)
- **Ticket Board**: Kanban-style board with drag-and-drop functionality
- **Update Tickets**: Modify ticket name, description, status, project, or assignee
- **Delete Tickets**: Remove tickets from projects
- **Ticket Details**: View comprehensive ticket information including all comments

#### Comment System

- **Add Comments**: Users can add comments to tickets
- **View Comments**: All comments displayed chronologically on ticket detail page
- **Edit Comments**: Comment authors can edit their own comments
- **Delete Comments**: Comment authors can delete their own comments
- **Email Notifications**: Assignees receive email notifications for new comments

#### User Interface

- **Responsive Design**: Works on desktop and tablet devices
- **Modern UI**: Clean, professional interface using Atlaskit Design System
- **Drag and Drop**: Intuitive ticket status changes via drag-and-drop
- **Real-time Updates**: (Frontend ready, backend HTTP-only for stability)
- **Error Handling**: User-friendly error messages and toast notifications
- **Loading States**: Clear loading indicators during API calls

---

## User Guide

### Accessing the Application

**Live Deployment URL**: https://cloudcollab-ufhp2.ondigitalocean.app/

The application is accessible via web browser. No additional software installation is required.

### Getting Started

#### 1. Registration and Login

**Registration**:
1. Navigate to the deployment URL
2. Click "Register here" or navigate to `/register`
3. Fill in the registration form:
   - **Name**: Your full name
   - **Email**: Your email address (must be unique)
   - **Password**: Choose a secure password (minimum 6 characters)
   - **Signup Token**: Enter the signup token provided by your administrator
     - For development/demo: `ECE1779-2025`
4. Click "Register"
5. Upon successful registration, you will be automatically logged in and redirected to the dashboard

**Login**:
1. Navigate to the deployment URL
2. Enter your email and password
3. Click "Login"
4. Upon successful login, you will be redirected to the dashboard

**Demo Accounts** (for testing):
- Email: `alice@example.com` / Password: `password123`
- Email: `bob@example.com` / Password: `password456`

#### 2. Dashboard Overview

After logging in, you will see the dashboard with:
- **Welcome Message**: Personalized greeting with your name
- **Statistics Cards**: 
  - Total Projects count
  - Active Projects count
- **Recent Projects**: List of your most recent projects (up to 5)
- **Quick Actions**: Button to view all projects

**Navigation**:
- Use the left sidebar to navigate between:
  - **Dashboard**: Overview of projects and statistics
  - **Projects**: Full list of all projects
- Click "Logout" in the sidebar footer to sign out

#### 3. Project Management

**Viewing All Projects**:
1. Click "Projects" in the sidebar or "View All Projects" on the dashboard
2. You will see a list of all projects you have access to
3. Use the search bar to filter projects by name

**Creating a New Project**:
1. Navigate to the Projects page
2. Click "New Project" button in the top right
3. Enter a project name in the dialog
4. Click "Create"
5. The new project will appear in your projects list

**Opening a Project Board**:
1. Click on any project card in the projects list
2. You will be taken to the project's ticket board
3. The board shows all tickets for that project grouped by status

**Editing a Project**:
1. Navigate to the Projects page
2. Find the project you created (only project creators can edit)
3. Click "Edit" on the project card
4. Enter a new project name
5. Click "Update"

**Deleting a Project**:
1. Navigate to the Projects page
2. Find a project you created (only project creators can delete)
3. Click "Delete" on the project card
4. Confirm the deletion in the dialog
5. **Warning**: Deleting a project will also delete all tickets in that project

#### 4. Ticket Management

**Viewing Tickets**:
- Tickets are displayed on the project board in four columns:
  - **To Do**: Tickets that haven't been started
  - **In Progress**: Tickets currently being worked on
  - **Done**: Completed tickets
  - **Won't Do**: Tickets that won't be completed

**Creating a New Ticket**:
1. Navigate to a project board
2. Click "New Ticket" button in the top right
3. Fill in the ticket form:
   - **Ticket Name**: A descriptive name for the ticket (required)
   - **Status**: Select initial status (To Do, In Progress, Done)
   - **Description**: Optional detailed description
4. Click "Create"
5. The new ticket will appear in the appropriate status column

**Viewing Ticket Details**:
1. Click on any ticket card on the board
2. You will be taken to the ticket detail page
3. The detail page shows:
   - Ticket name and status
   - Full description
   - Assignee information
   - All comments on the ticket
   - Action buttons (Edit, Delete)

**Editing a Ticket**:
1. Open the ticket detail page
2. Click "Edit Ticket" button
3. Modify any of the following:
   - Ticket name
   - Description
   - Status
   - Assignee (if other users exist)
4. Click "Update" to save changes

**Changing Ticket Status via Drag and Drop**:
1. On the project board, click and hold a ticket card
2. Drag it to a different status column
3. Release to drop the ticket
4. The ticket status will update automatically

**Deleting a Ticket**:
1. Open the ticket detail page
2. Click "Delete Ticket" button
3. Confirm the deletion in the dialog
4. You will be redirected back to the project board

**Filtering Tickets**:
1. On the project board, use the filter bar (if tickets exist)
2. Filter by:
   - **Search**: Text search in ticket names and descriptions
   - **Status**: Filter by specific status
   - **Assignee**: Filter by assigned user

#### 5. Comments

**Adding a Comment**:
1. Open a ticket detail page
2. Scroll to the "Comments" section
3. Type your comment in the text area
4. Click "Post Comment"
5. Your comment will appear immediately
6. If the ticket has an assignee, they will receive an email notification

**Viewing Comments**:
- Comments are displayed chronologically (oldest first)
- Each comment shows:
  - Comment author's name and avatar
  - Comment content
  - Relative time (e.g., "2 hours ago") or absolute date

**Editing a Comment**:
1. Find a comment you authored
2. Click "Edit" button on the comment
3. Modify the comment text
4. Click "Save" to update
5. Only you can edit your own comments

**Deleting a Comment**:
1. Find a comment you authored
2. Click "Delete" button on the comment
3. Confirm the deletion in the dialog
4. Only you can delete your own comments

#### 6. User Search (Assignees)

When creating or editing a ticket:
1. In the assignee field, start typing a user's name
2. The system will search for users matching your input
3. Select a user from the dropdown to assign them to the ticket

### Tips for Effective Use

- **Organize by Projects**: Create separate projects for different initiatives or teams
- **Use Descriptive Ticket Names**: Clear names make it easier to find and understand tickets
- **Update Status Regularly**: Keep ticket statuses current to reflect actual progress
- **Add Comments for Context**: Use comments to provide updates, ask questions, or share information
- **Assign Tickets**: Assign tickets to team members for clear ownership
- **Use Filters**: When working with many tickets, use filters to focus on specific subsets

---

## Development Guide

### Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Python 3.9+**: For backend development
- **Node.js 18+**: For frontend development
- **npm or yarn**: Node package manager
- **Git**: Version control
- **Docker** (optional): For containerized development
- **PostgreSQL** (optional): For local database (or use SQLite for simplicity)

### Environment Setup

#### Backend Setup

**Option 1: Local Development (Recommended for Development)**

1. **Navigate to backend directory**:
   ```bash
   cd app_backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in `app_backend/` directory:
   ```env
   USE_SQLITE=true
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   SENDGRID_API_KEY=your_sendgrid_key_here  # Optional
   ```

5. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Seed test data** (optional, auto-seeds on startup):
   ```bash
   python manage.py seed_data
   ```

7. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

   **API Endpoints**:
   - Health check: `http://localhost:8000/healthz`
   - Metrics: `http://localhost:8000/metrics`
   - API base: `http://localhost:8000/`

**Option 2: Docker Development**

1. **Build the Docker image**:
   ```bash
   cd app_backend
   docker build -t backend-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8000:8000 \
     -e USE_SQLITE=true \
     -e DJANGO_DEBUG=True \
     backend-app
   ```

#### Frontend Setup

**Option 1: Local Development (Recommended for Development)**

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API base URL** (optional):
   Create a `.env` file in `frontend/` directory:
   ```env
   VITE_API_BASE=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

   The Vite dev server is configured to proxy `/api/*` requests to `http://localhost:8000/*`

**Option 2: Docker Development**

1. **Build the Docker image**:
   ```bash
   cd frontend
   docker build -t frontend-app --build-arg VITE_API_BASE=http://localhost:8000 .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 frontend-app
   ```

### Database Setup

#### Using SQLite (Default for Local Development)

SQLite is used by default when `USE_SQLITE=true`. No additional setup is required. The database file (`db.sqlite3`) will be created automatically in the `app_backend/` directory.

#### Using PostgreSQL (Production-like Setup)

1. **Install PostgreSQL** (if not using Docker):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from postgresql.org

2. **Create a database**:
   ```bash
   createdb cloudcollab
   ```

3. **Update `.env` file**:
   ```env
   USE_SQLITE=false
   DATABASE_URL=postgres://username:password@localhost:5432/cloudcollab
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Seed test data**:
   ```bash
   python manage.py seed_data
   ```

### Storage Configuration

For local development, storage is handled automatically:
- **SQLite**: File-based storage in `app_backend/db.sqlite3`
- **PostgreSQL**: Local PostgreSQL instance or Docker container

For production deployment, use DigitalOcean Managed PostgreSQL with persistent storage.

### Local Testing

#### Running the Full Stack Locally

1. **Terminal 1 - Backend**:
   ```bash
   cd app_backend
   python manage.py runserver
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Health check: http://localhost:8000/healthz
   - Metrics: http://localhost:8000/metrics

#### Testing API Endpoints

You can test API endpoints using:

1. **Browser**: Navigate to API endpoints directly (for GET requests)
2. **cURL**: Command-line tool for API testing
3. **Postman**: GUI tool for API testing
4. **test_api.html**: Open `app_backend/test_api.html` in a browser for interactive API testing

**Example cURL commands**:

```bash
# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Get tickets (requires token from login)
curl http://localhost:8000/tickets \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

#### Running Tests

Currently, the project focuses on manual testing. Automated tests can be added using:
- **Backend**: Django's test framework (`python manage.py test`)
- **Frontend**: Jest + React Testing Library

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and test locally

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

6. **After review and merge**, CI/CD pipeline will build new images

### Troubleshooting

**Backend Issues**:
- **Port already in use**: Change port with `python manage.py runserver 8001`
- **Database errors**: Run `python manage.py migrate` to apply migrations
- **Import errors**: Ensure virtual environment is activated and dependencies are installed

**Frontend Issues**:
- **API connection errors**: Verify backend is running and `VITE_API_BASE` is correct
- **Build errors**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Port conflicts**: Change port in `vite.config.js` or use `npm run dev -- --port 3001`

**Docker Issues**:
- **Image build fails**: Check Dockerfile syntax and ensure all files are in context
- **Container won't start**: Check logs with `docker logs <container-id>`
- **Port conflicts**: Use different ports with `-p` flag

---

## Deployment Information

### Live Application

**Production URL**: https://cloudcollab-ufhp2.ondigitalocean.app/

The application is deployed on DigitalOcean Kubernetes and is accessible 24/7.

### Deployment Architecture

- **Kubernetes Cluster**: DigitalOcean Kubernetes Service
- **Backend Service**: Django application running in Kubernetes pods
- **Frontend Service**: React application served via Nginx in Kubernetes pods
- **Database**: DigitalOcean Managed PostgreSQL
- **Load Balancer**: DigitalOcean Load Balancer for external access
- **Monitoring**: DigitalOcean Monitoring + Prometheus metrics

### Deployment Process

1. **Code Push**: Changes pushed to main branch trigger CI/CD pipeline
2. **Image Build**: GitHub Actions builds Docker images for backend and frontend
3. **Image Push**: Images are pushed to GitHub Container Registry
4. **Kubernetes Update**: Kubernetes manifests are updated (manually or via CI/CD)
5. **Rolling Update**: Kubernetes performs rolling update of pods
6. **Health Checks**: Readiness and liveness probes ensure only healthy pods serve traffic

### Accessing Deployment

- **Web Application**: https://cloudcollab-ufhp2.ondigitalocean.app/
- **Health Check**: https://cloudcollab-ufhp2.ondigitalocean.app/healthz
- **Metrics Endpoint**: https://cloudcollab-ufhp2.ondigitalocean.app/metrics (requires authentication in production)

### Monitoring

- **DigitalOcean Dashboard**: Cluster and node metrics available in DigitalOcean control panel
- **Prometheus**: Scraping metrics from `/metrics` endpoint
- **Grafana**: Can be configured to visualize Prometheus metrics

---

## Individual Contributions

### Yu Zhang

- Backend development (Django REST API)
- Database models and migrations
- Authentication and authorization
- API endpoints for tickets, projects, comments, and users

### Wenxuan Wang

- Frontend development (React components)
- User interface design and implementation
- Frontend-backend API integration
- User experience improvements

### Xiao Sun

- Frontend development (React components and UI/UX)
- Assisted Xingda Jiang with Kubernetes deployment
- Infrastructure setup and testing support

### Xingda Jiang

- Frontend QOL update and bugfix
- Kubernetes manifests and Kustomize overlays (k8s/)
- Kubernetes deployment
- CI/CD pipeline
- Integration of Prometheus metrics and health endpoints


---

## Lessons Learned and Concluding Remarks

### Technical Insights

#### Kubernetes vs. Simpler Options

Kubernetes introduced more complexity than Docker Compose or Docker Swarm, but the experience was invaluable. Using minikube for local development and DigitalOcean Kubernetes for production provided hands-on experience with real-world orchestration patterns. We learned:

- **Configuration Management**: Kustomize overlays made it easier to manage environment-specific configurations
- **Health Checks**: Properly configured readiness and liveness probes are crucial for reliable deployments
- **Secrets Management**: Kubernetes Secrets provided a secure way to manage sensitive configuration
- **Rolling Updates**: Kubernetes' rolling update strategy ensured zero-downtime deployments

The learning curve was steep, but the knowledge gained will be valuable for future cloud-native projects.

#### Instrumentation Early is Worth It

Adding `/metrics` and Prometheus middleware early in the development process proved to be a wise decision. We could:

- **Monitor Performance**: Track request latencies and identify slow endpoints
- **Debug Issues**: Use metrics to understand traffic patterns and spot anomalies
- **Plan Scaling**: Make data-driven decisions about resource allocation
- **Troubleshoot**: Quickly identify when and where problems occurred

Having observability from the start made the entire development and deployment process smoother.

#### Separation of Concerns Helps Iteration

Maintaining a clean separation between the REST API backend and the React frontend allowed each side to evolve independently. This separation:

- **Enabled Parallel Development**: Frontend and backend developers could work simultaneously
- **Simplified Testing**: Each layer could be tested independently
- **Improved Maintainability**: Changes to one layer didn't require changes to the other
- **Facilitated API Evolution**: The API contract remained stable while implementations improved

This architectural decision paid dividends throughout the project lifecycle.

#### CI/CD Reduces Friction

Automating image builds and pushes with GitHub Actions removed many manual steps and made deployments more predictable. The CI/CD pipeline:

- **Eliminated Human Error**: Automated builds ensured consistency
- **Saved Time**: No manual Docker build and push steps
- **Provided Audit Trail**: All builds and deployments were logged
- **Enabled Rapid Iteration**: Quick feedback loop for testing changes

While the initial setup required effort, the ongoing benefits were significant.

#### Real-time Features Need Full-Stack Support

We initially planned WebSocket-based real-time updates for the ticket board. The frontend hook (`useSocket.js`) was implemented and ready, but we decided to keep the backend HTTP-only for this iteration. This decision:

- **Ensured Stability**: Focused on core functionality without additional complexity
- **Met Timeline**: Allowed us to deliver a stable, complete application on time
- **Demonstrated Scope Management**: Showed the importance of balancing features with reliability

The WebSocket infrastructure is ready for future implementation when backend support is added.

### Project Management Insights

#### Clear Communication is Essential

Regular team meetings and clear communication channels (GitHub Discussions, pull request reviews) were crucial for coordinating work across different components. Establishing clear responsibilities early helped avoid conflicts and ensure coverage of all requirements.

#### Documentation Saves Time

Comprehensive documentation, including setup guides, API documentation, and deployment instructions, proved invaluable. Well-documented code and processes:

- **Onboarded New Contributors**: Made it easy for team members to understand and contribute
- **Reduced Support Burden**: Answered common questions before they were asked
- **Enabled Reproducibility**: Made it possible to recreate the environment and deployment

#### Iterative Development Works

Starting with a minimal viable product and iteratively adding features allowed us to:

- **Deliver Value Early**: Core functionality was available quickly
- **Gather Feedback**: Early testing revealed issues and improvements
- **Manage Scope**: Could adjust features based on time and complexity
- **Maintain Quality**: Each iteration could be tested and refined

### Challenges Overcome

#### Database Migration Complexity

Managing database schema changes across different environments (local SQLite, local PostgreSQL, production PostgreSQL) required careful attention to migrations. We learned to:

- **Test Migrations Locally**: Always test migrations before applying to production
- **Version Control Migrations**: Keep migrations in Git for reproducibility
- **Handle Data Seeding**: Automate test data creation for consistent environments

#### Kubernetes Learning Curve

The initial Kubernetes setup was challenging, but breaking it down into smaller steps (base manifests, then overlays, then production deployment) made it manageable. Key learnings:

- **Start Simple**: Begin with basic deployments, add complexity gradually
- **Use Tools**: Kustomize simplified environment management
- **Test Locally**: minikube provided a safe testing environment
- **Document Everything**: Kubernetes configurations are complex; documentation is essential

#### Frontend-Backend Integration

Coordinating API contracts between frontend and backend required careful planning. We addressed this by:

- **API-First Design**: Defined API endpoints before implementation
- **Clear Error Handling**: Standardized error response formats
- **Type Safety**: Used TypeScript-like patterns in JavaScript for better code quality

### Future Improvements

While the current implementation meets all course requirements, several enhancements could be made:

1. **WebSocket Support**: Implement backend WebSocket support for real-time updates
2. **Automated Testing**: Add comprehensive unit and integration tests
3. **User Roles**: Implement role-based access control (admin, member, viewer)
4. **File Attachments**: Allow file uploads and attachments to tickets
5. **Advanced Filtering**: More sophisticated filtering and search capabilities
6. **Activity Logs**: Track and display activity history for tickets and projects
7. **Email Templates**: Customizable email notification templates
8. **Mobile App**: Native mobile applications for iOS and Android

### Concluding Remarks

CloudCollab successfully delivers a focused, stateful, cloud-native application that meets all core technical requirements of ECE1779 and demonstrates two advanced features (CI/CD and email notifications). The project solves a real collaboration problem faced by small teams while providing hands-on experience with modern cloud technologies.

The journey from initial concept to deployed application taught us valuable lessons about:

- **Cloud Architecture**: Understanding how containerization, orchestration, and monitoring work together
- **DevOps Practices**: Implementing CI/CD, health checks, and observability
- **Full-Stack Development**: Building and integrating frontend and backend systems
- **Project Management**: Coordinating team efforts and managing scope

The application is production-ready, well-documented, and demonstrates proficiency in cloud computing principles. It serves as a solid foundation for future enhancements and real-world deployment.

We are proud of what we've accomplished and grateful for the learning experience this project provided. CloudCollab represents not just a course project, but a practical tool that could genuinely help small teams collaborate more effectively.

---
### Video Demo

A video demonstration of the Local Guide application is available at:
- **Location**: https://youtu.be/iWGYpR4Y3m8
- **Platform**: YouTube
- **Content**: 
---
**Project Repository**: https://github.com/WenxuanWangut/1779

**Deployment URL**: https://cloudcollab-ufhp2.ondigitalocean.app/




