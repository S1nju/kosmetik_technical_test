# Backend Application

This is the backend for the KosmetikOn technical test, designed to manage Cosmetic Raw Materials via a robust REST API.

## Project Structure
The backend is organized using a layered architecture to keep responsibilities separate, maintainable, and highly testable:
- **/config** - Environment and Database connection configurations.
- **/controllers** - HTTP layer: extracting requests, calling services, and formatting HTTP responses.
- **/middlewares** - Global request intercepts like the Error Handler and Request Validators.
- **/migrations** - Step-by-step database schema versioning scripts.
- **/models** - Application entities representing exact database tables.
- **/repositories** - Data Access layer abstracting direct database calls away from business logic.
- **/routes** - Maps incoming HTTP paths & verbs to their corresponding controllers & middlewares.
- **/seeders** - Initial database injection scripts to quickly populate mock or functional data.
- **/services** - Core business logic, such as validation checks for unique names before creating/updating.
- **/tests** - Jest test suites divided into `unit` (mocked DB) and `e2e` (real HTTP requests via Supertest).

## Architecture & Choices
- **Node.js + Express**: Acts as the web server parsing scalable requests.
- **Dependency Injection (DI)**: The whole application is wired using DI (classes accept dependencies through their constructors). This provides vastly superior testing capabilities by allowing us to effortlessly inject mock repositories during unit testing, and forces a cleaner decoupled design.
- **JWT Authentication**: Included `/auth/register` and `/auth/login` endpoints utilizing `bcrypt` for secure hashing and `jsonwebtoken` for issuing access tokens to protect raw materials endpoints securely.
- **Sequelize ORM**: Implemented to provide clean, abstracted data interactions while leveraging Postgres. 
- **Sequelize Migrations**: Although initial requirements mentioned using a raw SQL initialization script, we implemented Sequelize Migrations. **Why migrations?** Because they track schema versions securely over time in source control, preventing mismatched developer environments. They allow automated, programmatic database setups and teardowns which is highly beneficial for CI/CD pipelines instead of relying entirely on raw `.sql` script mapping.
- **Docker Compose Networking & Health checks**: Implemented `pg_isready` natively into our stack. This guarantees Node waits seamlessly for database spinups, eliminating `HostNotFound` errors, while mapping variables securely via the core `.env` configurations.
- **express-validator**: Used for input validation on incoming requests to maintain consistency.
- **express-rate-limit**: Guards API endpoints against abuse by limiting burst requests to 100 per 15 minutes.
- **Swagger**: Included OpenAPI spec for interactive endpoint documentation.

## Running Locally Without Docker
1. Ensure PostgreSQL is installed and running. Create a database (e.g., `kosmetikon`).
2. Configure your Environment Variables: Check `.env.dev.example` and prepare your real `.env`.
   Required variables minimally include: 
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_HOST`
   - `POSTGRES_PORT` (default 5432)
3. Install dependencies: `npm install`
4. Run migrations and seed data: 
   - `npm run db:migrate`
   - `npm run db:seed`
5. Start the server: `npm start`
6. Visit the Swagger documentation at: `http://localhost:3000/api-docs`

## Tests
Testing runs across standard unit layers isolating the business logic, and E2E HTTP requests:
`npm test`
