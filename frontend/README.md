# Frontend for StatusPage application

This directory contains the frontend application for the StatusPage application.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Auth0**: Authentication and authorization as a service.
- **Zustand**: A small, fast, and scalable state-management solution.
- **Socket.io**: Real-time, bidirectional, and event-based communication.

## Project Structure

- `src/`: Contains the source code for the React application.
  - `components/`: Reusable UI components.
  - `constants/`: Constants used in the application.
  - `services/`: API services for fetching data.
  - `lib/`: Utility functions and helpers.
  - `store/`: Zustand store for managing global state.
  - `pages/`: Page components for different routes.
  - `types/`: TypeScript types and interfaces.
  - `styles/`: Global styles and Tailwind CSS configuration.
  - `index.css`: Main CSS file.
  - `main.tsx`: Entry point for the React application.
- `public/`: Static assets.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Project metadata and dependencies.

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. Open the application in your browser:

   [http://localhost:3000](http://localhost:3000)

## Scripts

- `yarn dev`: Start the development server.
- `yarn build`: Build the application for production.
- `yarn lint`: Run ESLint to lint the code.
- `yarn preview`: Preview the production build.

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_AUTH0_DOMAIN=<YOUR-AUTH0-DOMAIN>
VITE_AUTH0_CLIENT_ID=<YOUR-CLIENT-ID>
VITE_AUTH0_CLIENT_SECRET=<YOUR-CLIENT-SECRET>
VITE_AUTH0_SECRET=<YOUR-AUTH0-SECRET>

VITE_API_DOMAIN=<YOUR-BACKEND-DOMAIN>

VITE_APP_URL=<YOUR-FRONTEND-URL>
```

## Additional Development Information
 - Fast-tracked development by using a monorepo structure
 - Fast-tracked development by using LLMs like Bolt.new, GPT-3, Claude 3.5 Sonnet, etc

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