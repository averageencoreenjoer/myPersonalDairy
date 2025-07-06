# Personal diary API (backend focus)

This project is a full-featured web application for keeping a personal diary with an emphasis on backend development. The server part is implemented in Python using FastAPI and interacts with PostgreSQL, providing a RESTful API for the client application on React.

## Key features of the backend part

### Tech stack
- **Python 3.10+** - Main programming language
- **FastAPI** - a modern, fast web framework
- **PostgreSQL** - Relational database
- **Asyncpg** - Asynchronous driver for PostgreSQL
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server for running applications
- **Dotenv** - Managing environment variables

### Architectural solutions
- **Asynchronous architecture** - All database operations are performed asynchronously
- **RESTful API** - Clear separation of endpoints by resources
- **Layered architecture**:
  - Routing (FastAPI endpoints)
  - Business logic (CRUD operations)
  - Data models (Pydantic)
  - Data access (Asyncpg)
- **Reliable error handling**:
  - Custom HTTP exceptions
  - Input data validation
  - DB error handling

### Implementation Features
1. **Asynchronous DB interaction**
- Using asyncpg for efficient connection management
- Asynchronous context managers for connection management
- Connection pool for performance optimization

2. **Security and validation**
- Strict input validation with Pydantic
- Automatic generation of OpenAPI documentation
- SQL injection protection via parameterized queries

3. **Efficient data handling**
- Optimized SQL queries for CRUD operations
- Support for filtering by status when retrieving records
- Smart default values ​​(creation date)

4. **Reliability**
- Checking the DB connection when starting the application
- Handling unique violations and other DB errors
- Comprehensive tests for all use cases

## API Endpoints

### Create a note
```
POST /notes/
```
**Request body:**
```json
{
  "content": "Today was a productive day",
  "status": "active"
}
```

**Response:**
```json
{
  "id": 1,
  "created_at": "2023-10-05",
  "content": "Today was a productive day",
  "status": "active"
}
```

### Getting notes
```
GET /notes/
```
**Parameters:**
- `status` (optional): Filter by status (active/completed)

**Response:**
```json
[
  {
    "id": 1,
    "created_at": "2023-10-05",
    "content": "Note 1",
    "status": "active"
  },
  {
    "id": 2,
    "created_at": "2023-10-04",
    "content": "Note 2",
    "status": "completed"
  }
]
```

### Getting a specific note
```
GET /notes/{id}
```

### Updating note
```
PUT /notes/{id}
```
**Request body:**
```json
{
  "content": "Обновленный текст",
  "status": "completed"
}
```

### Delete note
```
DELETE /notes/{id}
```

## Launching the project

### Requirements
- Python 3.10+
- PostgreSQL 14+
- Node.js 16+ (for frontend)

### Setting up the backend

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

2. Install requirements:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (.env file):
```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diary_db
```

4. Create a database:
```sql
CREATE DATABASE diary_db;
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL
);
```

5. Start the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

### Frontend Launch
```bash
npm install
npm run dev
```

The frontend will be available at: `http://localhost:8080`

## Possible improvements

1. **Authentication and authorization**
- Add JWT authentication
- Implement division of records by users

2. **Additional functions**
- Search by record content
- Pagination of results
- Tags and categories for records

3. **Performance optimization**
- Caching of frequently requested data
- Implementation of rate limiting
- Optimization of complex queries

4. **Deployment**
- Docker containerization of the application
- Configuration for cloud deployment
- Setting up a CI/CD pipeline
