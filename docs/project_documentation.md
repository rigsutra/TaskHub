# Firebase Studio App Documentation

**Document Version:** 1.0

**Last Updated:** October 26, 2023

**Author:** AI Language Model

## 1. Introduction

### 1.1 Purpose

The Firebase Studio App is a web application designed to facilitate task creation, management, and participation. It allows users to create tasks, define meta-tags and participant limits, and enable other users to join those tasks. Furthermore, it includes user authentication features, ensuring secure access and personalized experiences.

### 1.2 Target Audience

This documentation is intended for developers, system administrators, and anyone interested in understanding the architecture, setup, and usage of the Firebase Studio App.

## 2. Technologies Used

### 2.1 Frontend

*   **TypeScript:**  A statically typed superset of JavaScript that enhances code quality and maintainability.
*   **Next.js:**  A React framework that provides server-side rendering, routing, and other advanced features for building modern web applications.
*   **React:** A JavaScript library for building user interfaces, forming the foundation of the application's UI.
*   **shadcn/ui:** UI components to create a consistent and reusable design.

### 2.2 Backend and Data

*   **PostgreSQL:** An open-source relational database management system used for storing user data and tasks.
*   **Redis:** An in-memory data structure store used for session management and token storage.
*   **bcrypt:** Used to hash and salt user passwords for security.
* **jsonwebtokens:** Used for generating and managing the tokens.

### 2.3 Development Environment

*   **Nix:** A package manager that ensures a consistent and reproducible development environment.
* **.idx/dev.nix:** file to configure the dev environment.

## 3. Project Structure
```
firebase-studio-app/
├── .idx/                   # Nix configuration for the development environment
│   └── dev.nix             # Defines services (PostgreSQL, Redis) and packages
├── .vscode/                # VS Code settings
│   └── settings.json       # Recommended editor settings
├── docs/                   # Documentation files
│   └── blueprint.md       # Initial project blueprint
├── src/                    # Source code directory
│   ├── ai/                 # AI-related logic
│   │   ├── ai-instance.ts
│   │   ├── dev.ts
│   │   └── flows/
│   │       └── suggest-meta-tags.ts
│   ├── app/                # Next.js application routes
│   │   ├── dashboard/          #protected route
│   │   │   └── page.tsx        # dashboard page
│   │   ├── login/              # Login route
│   │   │   └── page.tsx        # Login form
│   │   ├── signup/             # Signup route
│   │   │   └── page.tsx        # Signup form
│   │   ├── favicon.ico         # Favicon
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main application page (task creation)
│   ├── components/         # Reusable UI components
│   │   ├── icons.ts          # icons components
│   │   └── ui/               # Componentes from shadcn/ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                # Core application logic
│   │   ├── auth.ts           # Authentication functions
│   │   ├── db.ts             # Database interaction logic
│   │   └── utils.ts          # Utility functions
│   └── ...
├── next.config.ts           # Next.js configuration
├── package-lock.json        # Dependencies lock file
├── package.json             # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```
## 4. Setup Instructions

### 4.1 Prerequisites

*   **Nix:** Make sure you have Nix installed.
*   **Node.js:** Ensure that Node.js (version specified in `package.json`) is installed.
*   **Text Editor:** Visual Studio Code recommended.

### 4.2 Initial Setup

1.  **Clone the Repository:**
```
bash
    git clone <repository_url>
    cd firebase-studio-app
    
```
2.  **Enable Services:** Make sure that in the `.idx/dev.nix` file the next lines are present:
```
        postgresql.enable = true;
        redis.enable = true;
    
```
3. **Install packages:**
```
bash
npm install
```
4. **Run the server:**
```
bash
npm run dev
```
4.  **Environment Variables:**
    *   Ensure that PostgreSQL and Redis are running locally.
    *   Provide the correct credentials in the `src/lib/db.ts` file for the connection.

## 5. Usage Guide

### 5.1 Running the Application

1.  **Start the Development Server:**
```
bash
    npm run dev
    
```
2.  **Access the Application:** Open your web browser and go to `http://localhost:3000`.

### 5.2 Features

*   **Task Creation:** Create new tasks with descriptions, meta tags, and participant limits.
*   **Task Management:** View and manage created tasks.
*   **Task Participation:** Join available tasks.
*   **User Authentication:**
    *   **Signup:** Create a new user account.
    *   **Login:** Log in with an existing account.
    * **Dashboard:** A protected route, only available to the authenticated user.
    *   **Logout:** Log out of the current session.

## 6. API Endpoints

### 6.1 Authentication

#### 6.1.1 Signup

| Attribute         | Description                                        | Data Type | Constraints                      | Example                                  |
| ----------------- | -------------------------------------------------- | --------- | -------------------------------- | ---------------------------------------- |
| **Method**        | POST                                               | String    | Required                          |                                          |
| **Endpoint**      | `/signup`                                          | String    | Required                          |                                          |
| **Request Body**  |                                                    |           |                                  |                                          |
| username          | The desired username for the new user.             | String    | Required, Unique                   | "john_doe"                               |
| email             | The email address for the new user.                | String    | Required, Unique, Valid Email      | "john.doe@example.com"                     |
| password          | The password for the new user's account.           | String    | Required, Minimum length of 8 chars | "SecureP@sswOrd123"                      |
| **Successful Response** |                                                    |           |                                  |                                          |
| Status Code       | 201 Created                                        | Integer   |                                  |                                          |
| Body              | A success message indicating successful registration. | JSON      |                                  | `{ "message": "User registered successfully" }` |
| **Error Responses**   |                                                    |           |                                  |                                          |
| 400 Bad Request   | Invalid input data (e.g., missing fields, invalid email). | JSON      |                                  | `{ "error": "Invalid input data" }`         |
| 409 Conflict      | User with the provided email or username already exists. | JSON      |                                  | `{ "error": "User already exists" }`        |
| 500 Internal Server Error | An unexpected error occurred on the server. | JSON      |                                  | `{ "error": "Internal server error" }`    |

**Data Flow:**

1.  The user submits the signup form with the required information (username, email, password).
2.  The frontend sends a POST request to the `/signup` endpoint with the provided data in the request body.
3.  The backend receives the request, validates the input data, and checks for existing users with the same email or username.
4.  If the data is valid and no conflicts are found, the backend hashes the password, creates a new user record in the PostgreSQL database, and stores it.
5.  Upon successful user creation, the backend responds with a 201 Created status code and a success message.
6.  If any errors occur (e.g., invalid data, existing user, database error), the backend responds with an appropriate error status code (400, 409, 500) and an error message.

#### 6.1.2 Login

| Attribute         | Description                                              | Data Type | Constraints                    | Example                                        |
| ----------------- | -------------------------------------------------------- | --------- | ------------------------------ | ---------------------------------------------- |
| **Method**        | POST                                                     | String    | Required                        |                                                |
| **Endpoint**      | `/login`                                                 | String    | Required                        |                                                |
| **Request Body**  |                                                          |           |                                |                                                |
| email             | The user's registered email address.                     | String    | Required, Valid Email            | "john.doe@example.com"                           |
| password          | The user's password.                                     | String    | Required                         | "SecureP@sswOrd123"                            |
| **Successful Response** |                                                          |           |                                |                                                |
| Status Code       | 200 OK                                                   | Integer   |                                |                                                |
| Body              | A JSON object containing an authentication token.          | JSON      |                                | `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }` |
| **Error Responses**   |                                                          |           |                                |                                                |
| 400 Bad Request   | Invalid input data (e.g., missing fields, invalid email). | JSON      |                                | `{ "error": "Invalid input data" }`             |
| 401 Unauthorized  | Incorrect email or password.                             | JSON      |                                | `{ "error": "Invalid credentials" }`            |
| 500 Internal Server Error | An unexpected error occurred on the server.         | JSON      |                                | `{ "error": "Internal server error" }`        |

**Data Flow:**

1.  The user submits the login form with their email and password.
2.  The frontend sends a POST request to the `/login` endpoint with the credentials in the request body.
3.  The backend receives the request, validates the input data, and retrieves the user record from the PostgreSQL database based on the provided email.
4.  The backend compares the provided password with the stored hashed password.
5.  If the credentials are valid, the backend generates a JSON Web Token (JWT) and stores it in Redis for session management.
6.  The backend responds with a 200 OK status code and a JSON object containing the authentication token.
7.  If the credentials are invalid or any errors occur, the backend responds with an appropriate error status code (400, 401, 500) and an error message.

#### 6.1.3 Logout

| Attribute         | Description                                                                 | Data Type | Constraints             | Example                              |
| ----------------- | --------------------------------------------------------------------------- | --------- | ----------------------- | ------------------------------------ |
| **Method**        | POST                                                                        | String    | Required                |                                      |
| **Endpoint**      | `/logout`                                                                     | String    | Required                |                                      |
| **Request Headers** |                                                                             |           |                         |                                      |
| Authorization     | Bearer token for the current user's session.                                | String    | Required, Valid JWT     | `Authorization: Bearer eyJhbGciOiJIUzI1NiI...` |
| **Successful Response** |                                                                             |           |                         |                                      |
| Status Code       | 200 OK                                                                        | Integer   |                         |                                      |
| Body              | A success message indicating successful logout.                                | JSON      |                         | `{ "message": "Logged out successfully" }` |
| **Error Responses**   |                                                                             |           |                         |                                      |
| 401 Unauthorized  | Invalid or missing authentication token.                                      | JSON      |                         | `{ "error": "Unauthorized" }`         |
| 500 Internal Server Error | An unexpected error occurred on the server.                                  | JSON      |                         | `{ "error": "Internal server error" }`    |

**Data Flow:**

1.  The user initiates the logout action (e.g., clicking a logout button).
2.  The frontend sends a POST request to the `/logout` endpoint, including the authentication token in the `Authorization` header.
3.  The backend receives the request and verifies the validity of the provided token.
4.  Upon successful verification, the backend invalidates the token (e.g., by removing it from Redis).
5.  The backend responds with a 200 OK status code and a success message.
6.  If the token is invalid or missing, the backend responds with a 401 Unauthorized status code and an error message.
7.  If any unexpected errors occur, the backend responds with a 500 Internal Server Error status code and an error message.

### 6.2 Protected Route

#### 6.2.1 Dashboard

| Attribute          | Description                                                                 | Data Type | Constraints             | Example                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------- | --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Method**         | GET                                                                         | String    | Required                |                                                                                                                                       |
| **Endpoint**       | `/dashboard`                                                                  | String    | Required                |                                                                                                                                       |
| **Request Headers**  |                                                                             |           |                         |                                                                                                                                       |
| Authorization      | Bearer token for the current user's session.                                | String    | Required, Valid JWT     | `Authorization: Bearer eyJhbGciOiJIUzI1NiI...`                                                                                             |
| **Successful Response** |                                                                             |           |                         |                                                                                                                                       |
| Status Code        | 200 OK                                                                        | Integer   |                         |                                                                                                                                       |
| Body               | Protected content or user-specific data.                                     | Any       |                         | `<html><body><h1>Welcome to the Dashboard</h1><p>This is protected content.</p></body></html>` or `{ "user_id": "123e4567-e89b-12d3-a456-426614174000", ... }` |
| **Error Responses**    |                                                                             |           |                         |                                                                                                                                       |
| 401 Unauthorized   | Invalid or missing authentication token.                                      | JSON      |                         | `{ "error": "Unauthorized" }`                                                                                                          |
| 500 Internal Server Error | An unexpected error occurred on the server.                                  | JSON      |                         | `{ "error": "Internal server error" }`                                                                                                     |

**Data Flow:**

1.  The user navigates to the `/dashboard` route.
2.  The frontend (or middleware) intercepts the request and checks for the presence of an authentication token (typically in the `Authorization` header).
3.  If a token is present, the frontend (or middleware) sends a GET request to the `/dashboard` endpoint, including the token in the `Authorization` header.
4.  The backend receives the request, extracts the token, and verifies its validity (e.g., by checking if it exists in Redis).
5.  If the token is valid, the backend retrieves and returns the protected content or user-specific data.
6.  The backend responds with a 200 OK status code and the protected content in the response body.
7.  If the token is invalid or missing, the backend responds with a 401 Unauthorized status code and an error message.
8.  If any unexpected errors occur, the backend responds with a 500 Internal Server Error status code and an error message.

## 7. Database Schema

### 7.1 PostgreSQL (Users Table)

| Column     | Data Type | Constraints                  |
| :--------- | :-------- | :--------------------------- |
| id         | UUID      | Primary Key, Unique          |
| username   | TEXT      | Not Null, Unique             |
| email      | TEXT      | Not Null, Unique, Valid Email |
| password   | TEXT      | Not Null                     |
| created_at | TIMESTAMP | Default: Current Timestamp    |

## 8. Important Notes and Considerations

### 8.1 Security

*   **Password Hashing:** Passwords are not stored in plaintext. They are hashed and salted using `bcrypt` before being stored in the database.
*   **Token Management:** Authentication tokens are used to manage user sessions and stored in Redis.
*   **Input Validation:** Input validation should be added to prevent XSS and other vulnerabilities.

### 8.2 Error Handling

*   Robust error handling should be implemented throughout the application, especially in the `src/lib/auth.ts` and `src/lib/db.ts` files.

### 8.3 Scalability

*   Consider using connection pooling for PostgreSQL to handle a large number of concurrent database connections.
*   Redis can be scaled horizontally to handle increased session and token storage needs.

### 8.4 Future Enhancements

*   **API Development:** Create API endpoints for more complex data interactions.
*   **Testing:** Add unit and integration tests to ensure code quality.
*   **UI/UX Improvements:** Refine the user interface for a better user experience.
*   **More Database tables:** for example add a `tasks` table to manage the created task in the database.

## 9. Contact

For any questions or issues, please contact: \[Your Name/Team Name] at \[Your Email/Contact Info]