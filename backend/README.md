# Backend Application

This is the backend for the KosmetikOn technical test, designed to manage Cosmetic Raw Materials via a robust REST API.

## Architecture & Choices
- **Node.js + Express**: Acts as the web server for parsing robust requests.
- **Sequelize ORM**: Implemented to provide clean, abstracted, structured data interactions while still leveraging our Postgres SQL schema directly in the background. Included due to typical enterprise demands for scalability and validations.
- **Layered Arch**: Routes -> Controllers -> Services -> Repositories, decoupling HTTP concerns from business and data concerns.
- **express-validator**: Used for input validation on incoming requests to maintain consistency.
- **express-rate-limit**: Guards API endpoints against abuse by limiting burst requests to 100 per 15 minutes.
- **Jest + Supertest**: Integrated into `tests/unit` and `tests/e2e` for reliable API behavior checks mimicking real-world constraints.
- **Swagger**: Included OpenAPI spec for interactive endpoint documentation.

## Running Locally Without Docker
1. Ensure PostgreSQL is installed and the database `kosmetikon` exists. Ensure you've executed the SQL script located at `../database/01_schema_and_seed.sql`.
2. Configure your Environment Variables: Check `.env.dev.example` and prepare your real `.env`.
   Required variables minimally include: 
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_HOST`
   - `POSTGRES_PORT` (default 5432)
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Visit the Swagger documentation at: `http://localhost:3000/api-docs`

## Tests
Testing runs across standard unit layers isolating the business logic and full E2E HTTP requests:
`npm test`
