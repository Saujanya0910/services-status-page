# Backend for Services Status Page

This directory contains the backend application for the Services Status Page project.

## Technologies Used

- **Express**: A minimal and flexible Node.js web application framework.
- **Sequelize**: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **MySQL**: A relational database management system.
- **Redis**: An in-memory data structure store, used as a database, cache, and message broker.
- **Auth0**: Authentication and authorization as a service.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **dotenv**: A module that loads environment variables from a `.env` file into `process.env`.

## Project Structure

- `src/`: Contains the source code for the backend application.
  - `models/`: Sequelize models for the database.
  - `routes/`: Express routes for the API.
  - `middleware/`: Custom middleware functions.
  - `index.js`: Entry point for the backend application.
- `.env`: Environment variables file.
- `package.json`: Project metadata and dependencies.

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:

   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/status_page_db
   PORT=3000
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_AUDIENCE=your-auth0-audience
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. The backend application will be available at:

   [http://localhost:3000](http://localhost:3000)

## Scripts

- `yarn start`: Start the production server.
- `yarn dev`: Start the development server with nodemon.
- `yarn lint`: Run ESLint to lint the code.

## License

This project is open source and available under the [MIT License](../LICENSE).