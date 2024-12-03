# Backend for StatusPage application

This directory contains the backend application for the StatusPage application.

## Technologies Used

- **Express**: A minimal and flexible Node.js web application framework.
- **Sequelize**: A promise-based Node.js ORM coupled with MySQL.
- **MySQL**: A relational database management system - hosted on AWS RDS
- **Auth0**: Authentication and authorization as a service.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Socket.io**: Real-time, bidirectional, and event-based communication.
- **dotenv**: A module that loads environment variables from a `.env` file into `process.env`.

## Project Structure

- `src/`: Contains the source code for the backend application.
  - `models/`: Sequelize models for the database.
  - `routes/`: Express routes for the API.
  - `services/`: Business logic for the application.
  - `controllers/`: Request handlers for the API routes.
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

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
APP_URL=<YOUR-BACKEND-DOMAIN>
APP_PORT=<YOUR-BACKEND-PORT>
APP_CORS_ORIGIN=<YOUR-WHITELISTED-CLIENT-DOMAINS>

DATABASE_HOST=<YOUR-DATABASE-HOST>
DATABASE_PORT=<YOUR-DATABASE-PORT>
DATABASE_USERNAME=<YOUR-DATABASE-USERNAME>
DATABASE_PASSWORD=<YOUR-DATABASE-PASSWORD>
DATABASE_NAME=<YOUR-DATABASE-NAME>
```

## Additional Development Information
 - Fast-tracked development by using a monorepo structure
 - Fast-tracked development by using LLMs like Bolt.new, GPT-4o, Claude 3.5 Sonnet, Github Copilot, to name a few.

## Available Features
1. Public view page for real-time service status updates
2. Admin view page for managing services and incidents
3. User Authentication using Auth0
4. Multi-tenant organization structure
5. Invite users to join an organization (currently only using a shared invite code)
6. Real-time data updates using Server-Sent Events (SSE)

## Future Scope
1. As a user, be able to create or join multiple organizations.
2. Invite users via email
3. Increased set of roles and privileges
3. As an admin, be able to create and manage multiple organizations, grant users specific roles & privileges
4. Subscribe to incidents and receive notifications via email

## License

This project is open source and available under the [MIT License](../LICENSE).