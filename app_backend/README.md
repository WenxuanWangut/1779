# Django Backend - Board API

A simple Django REST API for managing tickets and users with token-based authentication.

## Prerequisites

- Python 3.9+
- pip

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Database Setup

### Run Migrations

Create and apply database migrations:

```bash
# Create migration files (after model changes)
python3 manage.py makemigrations

# Apply migrations to database
python3 manage.py migrate
```

### Seed Test Data

The app automatically seeds test data when the server starts. Alternatively, you can manually seed data:

```bash
python3 manage.py seed_data
```

This creates:
- 2 test users (alice@example.com / password123, bob@example.com / password456)
- 2 test projects (ECE1779 Final Project, Personal Tasks)
- 6 test tickets with various statuses, assignees, and projects
- 7 test comments on various tickets

## Running the Application

Start the development server:

```bash
python3 manage.py runserver
```

The server will start at `http://localhost:8000`

## Authentication

All ticket endpoints require authentication using token-based auth.

### Login

```bash
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "abc123def456...",
  "user": {
    "id": "uuid",
    "email": "alice@example.com",
    "name": "Alice Smith"
  }
}
```

### Using the Token

Include the token in the `Authorization` header for all authenticated requests:

```bash
Authorization: Token abc123def456...
```

### Logout

```bash
POST http://localhost:8000/logout
Authorization: Token abc123def456...
```

## API Endpoints

### Authentication Endpoints

#### Login
```
POST /login
```
Returns an authentication token.

#### Logout
```
POST /logout
Authorization: Token <token>
```
Invalidates the token.

### Ticket Endpoints (All Require Authentication)

#### Get All Tickets
```
GET /tickets
Authorization: Token <token>
```

Returns all tickets grouped by status. Each ticket includes its comments sorted by creation time.

**Example Response:**
```json
{
  "TODO": [
    {
      "id": 4,
      "name": "Add authentication",
      "description": "Implement user authentication and authorization",
      "status": "TODO",
      "project": {
        "id": "uuid",
        "name": "ECE1779 Final Project",
        "created_by": {
          "id": "uuid",
          "email": "alice@example.com",
          "name": "Alice Smith"
        }
      },
      "assignee": {
        "id": "uuid",
        "email": "bob@example.com",
        "name": "Bob Johnson"
      },
      "comments": [
        {
          "id": "uuid",
          "ticket": 4,
          "commentor": {
            "id": "uuid",
            "email": "bob@example.com",
            "name": "Bob Johnson"
          },
          "content": "Should we use JWT or session-based auth?",
          "created_at": "2024-01-01T12:00:00Z"
        },
        {
          "id": "uuid",
          "ticket": 4,
          "commentor": {
            "id": "uuid",
            "email": "alice@example.com",
            "name": "Alice Smith"
          },
          "content": "I think token-based would be better for our use case",
          "created_at": "2024-01-01T12:05:00Z"
        }
      ]
    }
  ],
  "IN_PROGRESS": [
    {
      "id": 3,
      "name": "Implement REST API endpoints",
      "description": "Create GET /tickets endpoint and user management APIs",
      "status": "IN_PROGRESS",
      "assignee": {
        "id": "uuid",
        "email": "alice@example.com",
        "name": "Alice Smith"
      }
    }
  ],
  "DONE": [
    {
      "id": 1,
      "name": "Setup project repository",
      "description": "Initialize the Git repository and set up the project structure",
      "status": "DONE",
      "assignee": {
        "id": "uuid",
        "email": "alice@example.com",
        "name": "Alice Smith"
      }
    }
  ],
  "WONT_DO": []
}
```

#### Create Ticket
```
POST /tickets/create
Authorization: Token <token>
Content-Type: application/json

{
  "name": "New ticket",
  "description": "Ticket description",
  "status": "TODO",
  "assignee_id": "uuid-of-user" (optional)
}
```

Creates a new ticket.

#### Update Ticket
```
PATCH /tickets/{ticket_id}
Authorization: Token <token>
Content-Type: application/json

{
  "name": "Updated name" (optional),
  "description": "Updated description" (optional),
  "status": "IN_PROGRESS" (optional),
  "project_id": "uuid-of-project" (optional),
  "assignee_id": "uuid-of-user" (optional)
}
```

Updates a ticket. All fields are optional - only provide the fields you want to change.

#### Delete Ticket
```
DELETE /tickets/{ticket_id}/delete
Authorization: Token <token>
```

Deletes a ticket.

### Comment Endpoints (All Require Authentication)

#### Get Comments for a Ticket
```
GET /tickets/{ticket_id}/comments
Authorization: Token <token>
```

Returns all comments for a specific ticket, ordered by creation time (oldest first).

**Example Response:**
```json
[
  {
    "id": "uuid",
    "ticket": 1,
    "commentor": {
      "id": "uuid",
      "email": "alice@example.com",
      "name": "Alice Smith"
    },
    "content": "This is a comment on the ticket",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

#### Create Comment
```
POST /tickets/{ticket_id}/comments/create
Authorization: Token <token>
Content-Type: application/json

{
  "content": "Your comment text"
}
```

Creates a new comment on a ticket. The authenticated user will be set as the commentor.

#### Update Comment
```
PATCH /comments/{comment_id}
Authorization: Token <token>
Content-Type: application/json

{
  "content": "Updated comment text"
}
```

Updates a comment. Only the commentor can update their own comment.

#### Delete Comment
```
DELETE /comments/{comment_id}/delete
Authorization: Token <token>
```

Deletes a comment. Only the commentor can delete their own comment.

### Project Endpoints (All Require Authentication)

#### Get All Projects
```
GET /projects
Authorization: Token <token>
```

Returns all projects.

**Example Response:**
```json
[
  {
    "id": "uuid",
    "name": "ECE1779 Final Project",
    "created_by": {
      "id": "uuid",
      "email": "alice@example.com",
      "name": "Alice Smith"
    }
  },
  {
    "id": "uuid",
    "name": "Personal Tasks",
    "created_by": {
      "id": "uuid",
      "email": "bob@example.com",
      "name": "Bob Johnson"
    }
  }
]
```

#### Get Single Project
```
GET /projects/{project_id}
Authorization: Token <token>
```

Returns details of a single project.

#### Create Project
```
POST /projects/create
Authorization: Token <token>
Content-Type: application/json

{
  "name": "New Project"
}
```

Creates a new project. The authenticated user will be set as the creator.

#### Update Project
```
PATCH /projects/{project_id}/update
Authorization: Token <token>
Content-Type: application/json

{
  "name": "Updated Project Name"
}
```

Updates a project. Only the project creator can update the project.

#### Delete Project
```
DELETE /projects/{project_id}/delete
Authorization: Token <token>
```

Deletes a project. Only the project creator can delete the project.
**Note:** This will also delete all tickets associated with this project (CASCADE).

## Testing the API

Open `test_api.html` in your browser to test all endpoints:

```bash
open test_api.html
# or
firefox test_api.html
```

The test page includes:
- Login/logout functionality
- Token display
- API request/response logger
- Ticket CRUD operations
- Visual ticket list

## cURL Examples

```bash
# Login
TOKEN=$(curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' \
  | jq -r '.token')

# Get all tickets
curl http://localhost:8000/tickets \
  -H "Authorization: Token $TOKEN"

# Create ticket
curl -X POST http://localhost:8000/tickets/create \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test ticket","description":"Testing","status":"TODO"}'

# Update ticket status
curl -X PATCH http://localhost:8000/tickets/1 \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

# Update ticket assignee and project
curl -X PATCH http://localhost:8000/tickets/1 \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignee_id":"user-uuid","project_id":"project-uuid"}'

# Delete ticket
curl -X DELETE http://localhost:8000/tickets/1/delete \
  -H "Authorization: Token $TOKEN"

# Get all projects
curl http://localhost:8000/projects \
  -H "Authorization: Token $TOKEN"

# Create project
curl -X POST http://localhost:8000/projects/create \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Project"}'

# Update project
curl -X PATCH http://localhost:8000/projects/{project_id}/update \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Project Name"}'

# Delete project
curl -X DELETE http://localhost:8000/projects/{project_id}/delete \
  -H "Authorization: Token $TOKEN"

# Get comments for a ticket
curl http://localhost:8000/tickets/1/comments \
  -H "Authorization: Token $TOKEN"

# Create comment
curl -X POST http://localhost:8000/tickets/1/comments/create \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"This is a comment"}'

# Update comment
curl -X PATCH http://localhost:8000/comments/{comment_id} \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated comment text"}'

# Delete comment
curl -X DELETE http://localhost:8000/comments/{comment_id}/delete \
  -H "Authorization: Token $TOKEN"

# Logout
curl -X POST http://localhost:8000/logout \
  -H "Authorization: Token $TOKEN"
```

## Models

### User
- `id` (UUID) - Unique identifier
- `email` (String) - User email (unique)
- `password` (String) - User password (plain text for development)
- `name` (String) - User name

### Project
- `id` (UUID) - Unique identifier
- `name` (String) - Project name
- `created_by` (ForeignKey) - User who created the project

### Ticket
- `id` (Integer) - Auto-incrementing ID
- `name` (String) - Ticket name
- `description` (Text) - Ticket description
- `status` (Choice) - TODO, IN_PROGRESS, DONE, WONT_DO
- `project` (ForeignKey) - Associated project (required)
- `assignee` (ForeignKey) - Assigned user (nullable)

### Comment
- `id` (UUID) - Unique identifier
- `ticket` (ForeignKey) - Associated ticket
- `commentor` (ForeignKey) - User who made the comment
- `content` (Text) - Comment text
- `created_at` (DateTime) - Timestamp when comment was created

## Authentication Details

- **Token Storage**: Tokens are stored in-memory on the server
- **Token Format**: Secure random 32-byte URL-safe tokens
- **Token Lifetime**: Tokens persist until logout or server restart
- **One Token Per User**: Each user can only have one active token at a time

## Development Notes

- The app uses SQLite as the database (file: `db.sqlite3`)
- Test data is automatically seeded on server startup
- Passwords are stored as plain text (for development only - use proper hashing in production)
- Tokens are stored in memory and will be lost on server restart
- All ticket endpoints require authentication

## Test Users

- **Alice**: alice@example.com / password123
- **Bob**: bob@example.com / password456
