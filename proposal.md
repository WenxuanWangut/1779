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

CloudCollab combines the **flexibility of self-hosting** with the **scalability of cloud infrastructure**, offering an accessible, 
maintainable, and technically sound alternative for real-time team collaboration.

## 2. Objective and Key Features

### Objectives
Build and deploy **CloudCollab**, a stateful cloud-native web app for multi-user collaboration with real-time updates and durable data using Docker, 
Docker Swarm on DigitalOcean, PostgreSQL with persistent storage, and provider monitoring. Include at least two advanced features to meet course requirements.

### Overall Architecture

#### Initial setup
For the purpose of this course, a simple setup is suggested:
- The backend layer will be a monolith written in **python django** for ease of bootstrapping.
- We will use Postgresql as the storage layer for its easy setup.
- There will be websocket connections established between the Web app and the backend for reactive updates.
- Deploy backend monolith on kubernetes to auto-scale based on CPU/RAM


![system.png](./system.png)

#### Future suggestion
For real world apps(not for this course) where the load might be significantly higher, a few enhancements can be added:
- There should be a central gateway service that handles request routing and potentially rate limiting
- CRUD for more stationary data can be handled in a management service, which can take less resources.
- CRUD for tasks will be the bottleneck and can be separated into a different service for stateless scaling
- DB considerations:
  - More stationary data can be put into regular postgres
  - Tasks and comments have mid-level traffic and can be sharded based on task_id
  - Audit trails will have most R/W loads, but no complex queries are needed and consistency requirement is the lowest. This is well suited for a NOSQL DB such as Cassandra.
- Websocket updates from notification service should be kept in kafka for load concerns, and also to handle traffic spikes and retries.

![system.png](./scaled_system.png)
### Data & Storage
PostgreSQL is chosen on the database layer with persistent **DigitalOcean Volumes** bound to named Swarm volumes.
Schema managed via migrations; nightly logical backups enable recovery.

![Imgur](https://imgur.com/MJXz68H)

### Infra / Ops considerations

#### Orchestration
Use **Docker Swarm** with replicated services, rolling updates, load balancing, overlay networks, and Swarm Secrets.
Compose files are deployed as a Swarm stack for multi-node scalability and fault tolerance.

#### Deployment
Deploy on **DigitalOcean**: 2–3 Droplets (managers/workers) plus Block Storage volumes. Images are built and pushed to a registry; stack updates via Swarm. Public ingress served by Caddy/Nginx with HTTPS.

#### Monitoring
Enable **DigitalOcean metrics/alerts** for CPU, memory, disk, and network; collect logs from containers.
Threshold alerts (e.g., CPU>80%, disk>80%) notify maintainers; dashboards track app health.

#### Advanced
1) **Real-time updates** with Socket.IO for live task boards  
2) **CI/CD** via GitHub Actions to build, push images, and redeploy the Swarm stack on push to `main`  
3) **Backup & recovery**: nightly `pg_dump` to DigitalOcean Spaces with one-command restore

### Requirements Fit
- Containerization & Compose: Dockerized services with local `docker-compose` for dev  
- State Management: PostgreSQL + DO Volumes for durability  
- Orchestration: Swarm replication, rolling updates, and load balancing  
- Deployment Provider: DigitalOcean Droplets and Volumes  
- Monitoring: Provider metrics, alerts, and logs  
- Advanced Features: Real-time collaboration and CI/CD (plus backups)

### Scope & Feasibility
MVP within the timeline: authentication, task CRUD, teams/projects, real-time updates, persistent PostgreSQL.
Swarm on DO keeps ops manageable for a 2–4 person team; CI/CD and backups add depth without excessive complexity.
This plan satisfies all core requirements and includes at least two advanced features.

## 3. Tentative Plan

### Collaboration Strategy  
Given the short project duration, the team will follow an **agile and collaborative workflow** focused on flexibility and continuous integration.  
Rather than assigning rigid roles, members will rotate across functional areas while each takes temporary ownership of one technical domain. This approach ensures balanced contributions and shared understanding of the full system.

### Technical Focus Areas  

- **Backend Development**  
  Implement RESTful APIs and WebSocket endpoints using Python Django.  
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
