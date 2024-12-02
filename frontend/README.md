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

## License

This project is open source and available under the [MIT License](../LICENSE).