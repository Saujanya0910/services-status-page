# Services Status Page

This is a monorepo for the Services Status Page application, which includes both frontend and backend projects.

## Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the Node.js backend application.

  Check the `README.md` file in each directory for more information about the respective projects.

## Setup

1. Install dependencies:

    Either install dependencies for both frontend and backend applications separately or run the following command to install dependencies for both applications at once:

    a. Install dependencies for both frontend and backend applications at once:

    Frontend:
    ```bash
    yarn frontend:setup
    ```
    Backend:
    ```bash
    yarn backend:setup
    ```

    OR

    b. Install dependencies for frontend and backend applications separately:

    Frontend:
    ```bash
    cd frontend
    ```

    ```bash
    yarn install
    ```

    Backend:
    ```bash
    cd backend
    ```

    ```bash
    yarn install
    ```

2. Start the frontend and backend applications development servers respectively:

    If at the root directory:

    ```bash
    yarn frontend:dev
    ```

    ```bash
    yarn backend:dev
    ```

    Else:

    Frontend:
    ```bash
    yarn dev
    ```

    Backend:
    ```bash
    yarn dev
    ```

3. Open the frontend application in your browser:
  
    [http://localhost:5176](http://localhost:5176)

4. Open the backend application in your browser:
  
    [http://localhost:3000](http://localhost:3000)

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

This project is open source and available under the [MIT License](LICENSE).