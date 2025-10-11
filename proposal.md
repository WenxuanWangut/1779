# Team Members

| Name       | Student ID |
| ---------- | ---------- |
| Xingda Jiang  | 1007170525 |
| Xiao Sun | 1005975090 |
| Wenxuan Wang | 1004975927 |
| Yu Zhang | 1002935229 |

## 1. Motivation

### Identifying the Problem  
Small teams such as student project groups, research labs, or startups often struggle to manage tasks efficiently. They rely on spreadsheets, chat tools, or free tiers of enterprise platforms like **Jira**, **Trello**, or **Asana**, which are expensive, complex, and unsuitable for lightweight collaboration.  
These teams need a simple, reliable, and self-deployable solution that enables real-time coordination and preserves full control over their data.

### Why This Project Is Worth Pursuing  
**CloudCollab** aims to fill this gap by providing a **cloud-native, real-time, and self-hosted task-management platform** designed for small, agile teams.  
The system integrates core cloud-computing concepts taught in **ECE1779**, including containerization, orchestration, persistent storage, monitoring, and automation.  
It allows users to create, assign, and track tasks collaboratively while maintaining data persistence and reliability.  
Beyond its technical value, the project offers hands-on experience in building scalable, stateful applications and demonstrates how cloud technologies can support practical teamwork.

### Target Users  
- **University project teams** needing transparent task coordination.  
- **Startups or small organizations** requiring cost-efficient workflow tools.  
- **Open-source contributors** seeking customizable and privacy-preserving platforms.

### Existing Solutions and Their Limitations  
Commercial products such as Jira and Trello provide extensive features but remain ill-suited for small teams due to:  
- **High cost** of premium subscriptions.  
- **Vendor lock-in** that restricts deployment flexibility.  
- **Overly complex interfaces** not tailored for small projects.  

CloudCollab combines the **flexibility of self-hosting** with the **scalability of cloud infrastructure**, offering an accessible, maintainable, and technically sound alternative for real-time team collaboration.


## 2. Objectives and Key Features

### 2.1 Objectives
The objective of **CloudCollab** is to build and deploy a **stateful, cloud-native web application** that supports:
- Multi-user collaboration with role-based access control.
- Real-time task updates and persistent data.
- Full containerization and orchestration using Docker Swarm on DigitalOcean.
- Automated monitoring and CI/CD for continuous deployment and reliability.

This project demonstrates mastery of all required technical components, ensuring strong alignment with course objectives and marking rubrics.



### 2.2 Core Technical Features

| Requirement | Implementation |
|--------------|----------------|
| **Containerization and Local Development** | Each component (frontend, backend, PostgreSQL) will be containerized using Docker. A `docker-compose.yml` file will enable local multi-container development. |
| **State Management and Persistence** | Task and user data will be stored in **PostgreSQL**, with data directories mounted on **DigitalOcean Volumes** to survive container restarts and redeployments. |
| **Deployment Provider** | The platform will be deployed on **DigitalOcean** using Droplets and managed Volumes. |
| **Orchestration** | **Docker Swarm** will be used for clustering, service replication, and load balancing. This approach enables multi-node scalability and fault tolerance. |
| **Monitoring and Observability** | DigitalOcean’s monitoring tools will be configured to track CPU, memory, disk usage, and HTTP metrics. Alerts will be triggered for resource thresholds (e.g., CPU > 80%, disk > 80%). |



### 2.3 Advanced Features (at least two)

| Feature | Description |
|----------|--------------|
| **1. Real-time Collaboration (WebSockets)** | Using Socket.IO, all team members connected to the same project will receive immediate updates when tasks are created, modified, or reassigned. This ensures a live, synchronized task board without manual refreshes. |
| **2. CI/CD Pipeline (GitHub Actions)** | Continuous Integration and Deployment will be implemented with GitHub Actions. On every `push` to the main branch, the workflow will: build Docker images, push them to the registry, and redeploy the updated stack on DigitalOcean. |
| **3. Automated Backup & Recovery (Bonus Feature)** | Daily PostgreSQL backups will be scheduled via `cron` and stored in DigitalOcean Spaces. A one-click restore script will be provided for data recovery, improving reliability and demonstrating operational automation. |



### 2.4 Security and Authentication

- **Authentication:** JWT-based authentication with access and refresh tokens.  
- **Authorization:** Role-based access control (Admin, Member).  
- **Secrets Management:** Docker Swarm Secrets will store sensitive data (JWT keys, DB credentials).  
- **Secure Communication:** All services exposed publicly will use HTTPS via Caddy or Nginx reverse proxy.  



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



### 2.7 Project Feasibility and Scope

The system focuses on **collaboration, persistence, and reliability** within a manageable scope.  
The MVP includes:
- User authentication  
- Task creation and updates  
- Real-time task synchronization  
- Persistent PostgreSQL storage  

Advanced features such as CI/CD and automated backups enhance technical depth without overcomplicating implementation.  
This ensures the project remains achievable within the course timeline while fully meeting all rubric requirements.

## 3. Tentative Plan

### Collaboration Strategy  
Given the short project duration, the team will follow an **agile and collaborative workflow** focused on flexibility and continuous integration.  
Rather than assigning rigid roles, members will rotate across functional areas while each takes temporary ownership of one technical domain. This approach ensures balanced contributions and shared understanding of the full system.

### Technical Focus Areas  

- **Backend Development**  
  Implement RESTful APIs and WebSocket endpoints using Node.js and Express.  
  Design the PostgreSQL schema, handle authentication and authorization, and maintain secure, modular data exchange between backend and frontend.

- **Frontend Development**  
  Build an intuitive React interface for viewing, creating, and updating tasks in real time.  
  Integrate WebSocket communication for live updates and ensure responsive, user-friendly interaction.

- **DevOps and Deployment**  
  Containerize all services using Docker and orchestrate them with Docker Swarm.  
  Deploy to DigitalOcean with persistent storage volumes and HTTPS configuration for secure access and scalability.

- **Infrastructure, Automation, and Quality Assurance**  
  Set up CI/CD pipelines via GitHub Actions, implement monitoring and alerting with DigitalOcean metrics, and automate PostgreSQL backups.  
  Conduct integration testing and maintain technical documentation for reproducibility.

### Development Process  
- **Version Control:** Use GitHub with feature branches and pull requests for code review and collaboration.  
- **Continuous Integration:** Automated build and test pipelines ensure reliable deployments.  
- **Communication:** Coordinate through GitHub Discussions and weekly team check-ins to track progress and address blockers.  
- **Quality Assurance:** Enforce peer review for major updates to maintain consistent coding standards.  
- **Documentation:** Keep setup, deployment, and troubleshooting instructions current in the project’s README and Wiki.  

This modular and collaborative process enables steady progress, efficient testing, and seamless integration.  
By focusing on technical depth rather than breadth, the team can deliver a **robust, stateful, and cloud-native platform** within the course timeline.

## 4. Alignment with Course Learning Objectives

This project is designed to showcase complete mastery of course concepts:

| Learning Objective | Implementation |
|---------------------|----------------|
| **Containerization** | All components Dockerized with multi-container setup. |
| **Stateful Cloud Application** | PostgreSQL persistent data via DigitalOcean Volumes. |
| **Orchestration** | Docker Swarm with replicated services. |
| **Monitoring & Observability** | Platform metrics and alert rules configured in DigitalOcean. |
| **Advanced Cloud Features** | CI/CD automation and WebSocket real-time updates. |


## 5. Conclusion

**CloudCollab** demonstrates a practical and fully-featured cloud-native application that embodies the principles of modern DevOps and cloud architecture.  
It offers real-world relevance, full alignment with the course rubric, and strong technical depth for a 4-person team.  

By focusing on a well-scoped, stateful, and collaborative system, the project will showcase our team’s ability to design, build, deploy, and maintain an end-to-end application in a cloud environment with robust persistence and monitoring.
