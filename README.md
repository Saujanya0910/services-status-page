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

## License

This project is open source and available under the [MIT License](LICENSE).