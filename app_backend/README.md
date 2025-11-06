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
- 6 test tickets with various statuses and assignees

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

Returns a list of all tickets with their details including assignee information.

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Setup project repository",
    "description": "Initialize the Git repository and set up the project structure",
    "status": "DONE",
    "assignee": {
      "id": "d352114a-3e73-46f5-950d-d2548835782d",
      "email": "alice@example.com",
      "name": "Alice Smith"
    }
  }
]
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
  "status": "IN_PROGRESS" (optional),
  "assignee_id": "uuid-of-user" (optional)
}
```

Updates a ticket.

#### Delete Ticket
```
DELETE /tickets/{ticket_id}/delete
Authorization: Token <token>
```

Deletes a ticket.

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

# Update ticket
curl -X PATCH http://localhost:8000/tickets/1 \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

# Delete ticket
curl -X DELETE http://localhost:8000/tickets/1/delete \
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

### Ticket
- `id` (Integer) - Auto-incrementing ID
- `name` (String) - Ticket name
- `description` (Text) - Ticket description
- `status` (Choice) - TODO, IN_PROGRESS, DONE, WONT_DO
- `assignee` (ForeignKey) - Assigned user (nullable)

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
