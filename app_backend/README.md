# Django Backend - Board API

A simple Django REST API for managing tickets and users.

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
- 2 test users (alice@example.com, bob@example.com)
- 6 test tickets with various statuses and assignees

## Running the Application

Start the development server:

```bash
python3 manage.py runserver
```

The server will start at `http://localhost:8000`

## API Endpoints

### Get All Tickets
```
GET http://localhost:8000/tickets
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

## Development Notes

- The app uses SQLite as the database (file: `db.sqlite3`)
- Test data is automatically seeded on server startup
- Password storage is plain text (for development only - use proper hashing in production)

