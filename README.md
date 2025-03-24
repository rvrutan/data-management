# Express PostgreSQL API

This is a simple Express.js application that handles POST requests and stores data in PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your database:
   - Copy the `.env.example` file to `.env`
   - Update the database credentials in the `.env` file

3. Create your PostgreSQL database and tables (SQL will be provided once table structure is defined)

4. Start the server:
```bash
node server.js
```

## API Endpoints

### POST /api/data
Accepts JSON data and stores it in the database.

Example request:
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"your": "data"}'
```

## Environment Variables

- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `PORT`: Server port (default: 3000) 