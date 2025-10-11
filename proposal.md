# Team Members

| Name       | Student ID |
| ---------- | ---------- |
| Xingda Jiang  | 1007170525 |
| Xiao Sun | 1005975090 |
| Wenxuan Wang | 1004975927 |
| Yu Zhang | 1002935229 |

## 1. Motivation

In modern team-based environments, small groups often face challenges in managing tasks efficiently without relying on complex or paid solutions like Jira or Trello. While these tools provide robust functionality, they are typically designed for large organizations and are not optimized for lightweight, self-hosted deployment.

Our project, **CloudCollab**, aims to bridge this gap by providing a **cloud-native, stateful, and self-deployable task management platform** tailored for small teams (2–20 members) such as student project groups or startups. The system will allow users to create, assign, and track tasks in real time with role-based access, persistent data, and integrated monitoring.  

Unlike static task boards or temporary web tools, CloudCollab will emphasize:
- **Persistence and state management:** Ensuring data survives container restarts or redeployments.  
- **Real-time collaboration:** Providing immediate task updates using WebSockets.  
- **Automation and reliability:** Using CI/CD pipelines and monitoring for high availability.  

### Target Users
Our target audience includes:
- University project teams collaborating on assignments or capstone projects.  
- Small startups requiring lightweight task coordination without external dependencies.  
- Any small organization that wants a self-managed and cloud-deployed task management solution.

### Why This Project Is Worth Pursuing
This project directly demonstrates key cloud computing principles — containerization, orchestration, persistent storage, monitoring, and automation — all core components of the course. It also provides a meaningful and reusable product, as the final system can be deployed and extended beyond the course.

---

## 2. Objectives and Key Features

### 2.1 Objectives
The objective of **CloudCollab** is to build and deploy a **stateful, cloud-native web application** that supports:
- Multi-user collaboration with role-based access control.
- Real-time task updates and persistent data.
- Full containerization and orchestration using Docker Swarm on DigitalOcean.
- Automated monitoring and CI/CD for continuous deployment and reliability.

This project demonstrates mastery of all required technical components, ensuring strong alignment with course objectives and marking rubrics.

---

### 2.2 Core Technical Features

| Requirement | Implementation |
|--------------|----------------|
| **Containerization and Local Development** | Each component (frontend, backend, PostgreSQL) will be containerized using Docker. A `docker-compose.yml` file will enable local multi-container development. |
| **State Management and Persistence** | Task and user data will be stored in **PostgreSQL**, with data directories mounted on **DigitalOcean Volumes** to survive container restarts and redeployments. |
| **Deployment Provider** | The platform will be deployed on **DigitalOcean** using Droplets and managed Volumes. |
| **Orchestration** | **Docker Swarm** will be used for clustering, service replication, and load balancing. This approach enables multi-node scalability and fault tolerance. |
| **Monitoring and Observability** | DigitalOcean’s monitoring tools will be configured to track CPU, memory, disk usage, and HTTP metrics. Alerts will be triggered for resource thresholds (e.g., CPU > 80%, disk > 80%). |

---

### 2.3 Advanced Features (at least two)

| Feature | Description |
|----------|--------------|
| **1. Real-time Collaboration (WebSockets)** | Using Socket.IO, all team members connected to the same project will receive immediate updates when tasks are created, modified, or reassigned. This ensures a live, synchronized task board without manual refreshes. |
| **2. CI/CD Pipeline (GitHub Actions)** | Continuous Integration and Deployment will be implemented with GitHub Actions. On every `push` to the main branch, the workflow will: build Docker images, push them to the registry, and redeploy the updated stack on DigitalOcean. |
| **3. Automated Backup & Recovery (Bonus Feature)** | Daily PostgreSQL backups will be scheduled via `cron` and stored in DigitalOcean Spaces. A one-click restore script will be provided for data recovery, improving reliability and demonstrating operational automation. |

---

### 2.4 Security and Authentication

- **Authentication:** JWT-based authentication with access and refresh tokens.  
- **Authorization:** Role-based access control (Admin, Member).  
- **Secrets Management:** Docker Swarm Secrets will store sensitive data (JWT keys, DB credentials).  
- **Secure Communication:** All services exposed publicly will use HTTPS via Caddy or Nginx reverse proxy.  

---

### 2.5 Database Schema Overview

| Table | Key Columns | Description |
|--------|--------------|-------------|
| `users` | `id, email, password_hash, created_at` | Stores registered user accounts. |
| `teams` | `id, name, created_at` | Represents collaboration groups. |
| `team_members` | `team_id, user_id, role` | Defines membership and access roles. |
| `projects` | `id, team_id, name, description` | Holds project-level information. |
| `tasks` | `id, project_id, title, description, status, assignee_id, due_date` | Tracks tasks assigned to members. |
| `comments` | `id, task_id, author_id, content, created_at` | Stores task-level discussion threads. |
| `activity_logs` | `id, team_id, actor_id, type, payload, created_at` | Tracks system and user activities for observability. |

All tables will include timestamps and foreign key relationships to enforce data integrity.

---

### 2.6 System Architecture

[Frontend (React)] <--REST & WebSocket--> [Backend API (Node.js/Express)]
|
[PostgreSQL Database]
|
[DigitalOcean Volumes - Persistent Storage]
|
[Docker Swarm Cluster - Replicated Services]
|
[Monitoring & Alerts (CPU, Disk, Memory)]


---

### 2.7 Project Feasibility and Scope

The system focuses on **collaboration, persistence, and reliability** within a manageable scope.  
The MVP includes:
- User authentication  
- Task creation and updates  
- Real-time task synchronization  
- Persistent PostgreSQL storage  

Advanced features such as CI/CD and automated backups enhance technical depth without overcomplicating implementation.  
This ensures the project remains achievable within the course timeline while fully meeting all rubric requirements.

---

## 3. Tentative Plan

### 3.1 Team Members and Responsibilities

| Member | Role | Responsibilities |
|---------|------|------------------|
| **Member A** | Backend Developer | Design and implement REST APIs, database schema, authentication, and WebSocket endpoints. |
| **Member B** | Frontend Developer | Build the React interface, implement real-time updates, and manage task board UI/UX. |
| **Member C** | DevOps Engineer | Configure Docker Compose and Docker Swarm; handle deployment and persistent volumes. |
| **Member D** | Infrastructure & QA Lead | Set up monitoring, CI/CD pipeline, database backup, and final documentation/video demo. |

---

### 3.2 Development Timeline

| Phase | Dates | Deliverables |
|--------|--------|--------------|
| **Phase 1** | Oct 8 – Oct 20 | Local prototype with Docker Compose (API + DB + UI). Submit project proposal. |
| **Phase 2** | Oct 21 – Nov 3 | Deploy to DigitalOcean using Docker Swarm with persistent storage and HTTPS. |
| **Phase 3** | Nov 4 – Nov 17 | Implement WebSocket real-time collaboration and CI/CD pipeline. |
| **Phase 4** | Nov 18 – Nov 24 | Prepare presentation demo; finalize monitoring dashboard and backup system. |
| **Phase 5** | Nov 25 – Dec 8 | Polish code, documentation, and record final video demo for submission. |

---

### 3.3 Expected Outcomes

By the final deadline, CloudCollab will deliver:
- A fully functional, **stateful task management platform** hosted on DigitalOcean.  
- Real-time updates and monitoring with persistent data storage.  
- Automated CI/CD pipeline ensuring continuous delivery.  
- A professional README, reproducible setup, and demonstration video.  

---

### 3.4 Feasibility and Risk Mitigation

| Potential Risk | Mitigation Strategy |
|-----------------|---------------------|
| WebSocket synchronization issues | Start with REST-based polling and upgrade to WebSocket once core CRUD works. |
| Orchestration complexity | Begin with Docker Compose → scale to Swarm incrementally. |
| CI/CD configuration errors | Use test environment before enabling auto-deploy on production. |
| Data loss | Nightly database backups + manual restore script. |
| Time constraints | Parallelize workstreams: backend & frontend; DevOps in parallel. |

---

## 4. Alignment with Course Learning Objectives

This project is designed to showcase complete mastery of course concepts:

| Learning Objective | Implementation |
|---------------------|----------------|
| **Containerization** | All components Dockerized with multi-container setup. |
| **Stateful Cloud Application** | PostgreSQL persistent data via DigitalOcean Volumes. |
| **Orchestration** | Docker Swarm with replicated services. |
| **Monitoring & Observability** | Platform metrics and alert rules configured in DigitalOcean. |
| **Advanced Cloud Features** | CI/CD automation and WebSocket real-time updates. |

---

## 5. Conclusion

**CloudCollab** demonstrates a practical and fully-featured cloud-native application that embodies the principles of modern DevOps and cloud architecture.  
It offers real-world relevance, full alignment with the course rubric, and strong technical depth for a 4-person team.  

By focusing on a well-scoped, stateful, and collaborative system, the project will showcase our team’s ability to design, build, deploy, and maintain an end-to-end application in a cloud environment with robust persistence and monitoring.

---

### Team Members
- Member A  
- Member B  
- Member C  
- Member D  

**Deployment Provider:** DigitalOcean  
**Orchestration Approach:** Docker Swarm  
**Advanced Features:** WebSocket, CI/CD Pipeline, Automated Backup  
**Repository:** (To be provided upon final submission)

---
