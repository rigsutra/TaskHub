# Firebase Studio App: A Comprehensive Learning Guide

This document provides a detailed guide to the Firebase Studio App project, explaining its architecture, the technologies used, and how they work together. It's designed to help you understand the project's inner workings and enable you to contribute to its future development.

## Part 1: Project Overview

### High-Level Purpose

The Firebase Studio App is a web application designed to facilitate task creation, management, and participation among users. It allows users to create tasks, define metadata (meta-tags), and set participation limits. Other users can then view and join these tasks. The application also features user authentication, ensuring secure access and personalized experiences.

### Key Features

*   **Task Creation:** Users can create new tasks, providing a description, meta tags, and the maximum number of participants.
*   **Task Management:** Users can view the tasks they have created.
*   **Task Participation:** Users can join tasks created by other users.
*   **User Authentication:**
    *   **Signup:** New users can create accounts.
    *   **Login:** Existing users can log in to access the application.
    *   **Dashboard:** An authenticated page to see only the authenticated users.
    *   **Logout:** Users can securely log out of their session.

### Overall Architecture

The application follows a modern web architecture consisting of:

1.  **Frontend (Client-Side):**
    *   Built using **React** and **Next.js** for dynamic user interfaces.
    *   Handles user interactions, rendering, and navigation.
    *   Communicates with the backend via API requests.
2.  **Backend (Server-Side):**
    *   Handles user authentication (login/signup/logout).
    *   Manages user data.
    *   Connects to databases (PostgreSQL and Redis).
3.  **Databases:**
    *   **PostgreSQL:** Stores persistent data (user information).
    *   **Redis:** Stores temporary data like authentication tokens for session management.

**Diagram:**
```
mermaid
graph LR
    A[User's Browser] --> B(Frontend - Next.js/React);
    B -- API Requests --> C(Backend - Node.js/TypeScript);
    C -- User Data --> D(PostgreSQL);
    C -- Session Data --> E(Redis);
```
## Part 2: Technology Deep Dive

### TypeScript

#### What is it and Why it's Used

TypeScript is a statically typed superset of JavaScript that adds static typing to the language. This means you can define the type of variables, function parameters, and return values. It's used in this project to improve code quality, maintainability, and developer productivity.

#### Key Concepts

*   **Types:** Defining the kind of data a variable can hold (e.g., `string`, `number`, `boolean`, custom objects).
*   **Interfaces:** Defining contracts for objects, specifying their structure and the types of their properties.
*   **Classes:** Templates for creating objects, allowing for object-oriented programming principles like inheritance and encapsulation.
*   **Enums:** Defining sets of named constants.
* **Generics:** Providing a way to write functions or classes that work with a variety of types.

#### How it Improves Code Quality and Maintainability

*   **Early Error Detection:** Type checking at compile-time catches many errors before runtime.
*   **Code Readability:** Explicit types make code easier to understand.
*   **Refactoring:** Type checking makes refactoring safer.
*   **Autocompletion:** IDEs can provide better autocompletion and suggestions.

#### Examples
```
typescript
// Example of an interface
interface User {
  id: string;
  username: string;
  email: string;
}

// Example of a function with type annotations
function greetUser(user: User): string {
  return `Hello, ${user.username}!`;
}
```
### Next.js

#### What it is and Why it's Used

Next.js is a React framework that enhances React applications with features like server-side rendering (SSR), static site generation (SSG), and file-based routing. It's used to build a more efficient and performant web application.

#### Key Features

*   **File-Based Routing:** Pages are automatically created based on the file structure in the `src/app` directory.
*   **Server-Side Rendering (SSR):** Pages can be rendered on the server for improved performance and SEO.
*   **Static Site Generation (SSG):** Pages can be generated at build time.
*   **API Routes:** You can create API endpoints by creating files in the `src/app/api` directory.
*   **Automatic Code Splitting:** Next.js splits your code into smaller chunks to improve performance.
*   **Image Optimization:** Next.js provides the `<Image />` component, which optimize the images.

#### How it Interacts with React

Next.js extends React with additional features and conventions. It leverages React's component model and JSX.

#### Examples

*   **File-Based Routing:**
    *   `src/app/login/page.tsx` maps to `/login`.
    * `src/app/dashboard/page.tsx` maps to `/dashboard`
* **Server component**
```
typescript
//in the src/app/login/page.tsx file
export default async function LoginPage(){
    //...
}
```
### React

#### What it is and its Core Principles

React is a JavaScript library for building user interfaces.

*   **Components:** UIs are broken down into reusable components.
*   **JSX:** A syntax extension that allows you to write HTML-like code within JavaScript.
*   **State:** Data that can change over time within a component.
*   **Props:** Data passed from parent components to child components.

#### How it's Used within Next.js

Next.js uses React for its component model. You build React components that Next.js renders.

#### Examples
```
typescript
// Example of a React component
import {Button} from "@/components/ui/button"

function MyButton({children}: {children: React.ReactNode}) {
  return <Button>{children}</Button>;
}
```
### PostgreSQL

#### What it is and Why it's Used

PostgreSQL is a powerful, open-source relational database management system (RDBMS). It's used to persistently store user information in the project.

#### How Data is Structured

*   **Tables:** Data is organized into tables.
*   **Columns:** Each table has columns that represent attributes (e.g., `id`, `username`, `email`).
*   **Data Types:** Each column has a specific data type (e.g., `UUID`, `TEXT`, `TIMESTAMP`).

#### How it's Connected to the Backend

The backend establishes a connection to PostgreSQL using the credentials in the `src/lib/db.ts` file.

#### How Data is Queried and Modified

The backend uses SQL queries to interact with PostgreSQL. For example, to:

*   **Create a user:** `INSERT INTO users (id, username, email, password) VALUES (...)`
*   **Find a user:** `SELECT * FROM users WHERE email = ...`

### Redis

#### What it is and Why it's Used

Redis is an in-memory data structure store, used in this project for session management and authentication token storage.

#### How it's Used for Sessions and Token Storage

*   **Token Storage:** When a user logs in, an authentication token (JWT) is stored in Redis.
* **Session management:** Store the session in redis.

#### How it Interacts with the Backend

The backend uses Redis commands (via a Redis client library) to:

*   **Set:** Store a token with a user ID as the key.
*   **Get:** Retrieve a token by user ID.
*   **Delete:** Remove a token when a user logs out.

### bcrypt and jsonwebtoken

* **bcrypt:**
   * What is it?: It's a library for password hashing.
   * How we are using it in this project: We are using this library to hash and salt the password, so the password will be secure in the database.
* **jsonwebtoken:**
   * What is it?: This is the library that we are using to manage the authentication tokens.
   * How we are using it in this project: We are using this library to generate a JWT, and manage the token by the request.

### Nix

* **What is Nix**?: Nix is a powerful package manager that allows for reproducible builds and development environments.
* **Why is it used?** :
   * **Reproducibility**: ensures that everyone on the team, or even different machines, can have the exact same development environment.
   * **Isolation**: each project can have its own set of dependencies and versions, preventing conflicts.
   * **Declarative**: the environment is defined in a `dev.nix` file.
* **How is it used in this project?**
   * The `.idx/dev.nix` file defines the development environment for the project, including:
      * Packages: the `nixpkgs.postgresql.withPackages` and `nixpkgs.redis` packages, which contain the commands for PostgreSQL and redis.
      * Services: we are using the postgresql and the redis services in this file.

## Part 3: Project Walkthrough

### Data Flow

#### User Registration

1.  **Input:** User enters data in the signup form.
2.  **Request:** Frontend sends a POST request to `/signup` with the data.
3.  **Validation:** Backend validates the data (e.g., valid email, unique username).
4.  **Hashing:** Backend hashes the password using `bcrypt`.
5.  **Database:** Backend stores user data (including the hashed password) in PostgreSQL.
6.  **Response:** Backend sends a success message to the frontend.

#### User Login

1.  **Input:** User enters email and password in the login form.
2.  **Request:** Frontend sends a POST request to `/login` with the credentials.
3.  **Lookup:** Backend finds the user in PostgreSQL by email.
4.  **Comparison:** Backend compares the entered password with the stored hashed password using `bcrypt`.
5.  **Token Generation:** If successful, the backend generates a JWT.
6.  **Token Storage:** The JWT is stored in Redis (optional).
7.  **Response:** Backend sends the JWT to the frontend.

#### Creating a Task

1.  **Input:** User enters task details.
2.  **Request:** Frontend sends the task details to an API endpoint (not implemented yet).
3.  **Database:** Backend stores the task in PostgreSQL (not implemented yet).
4.  **Response:** Backend sends a success message.

#### Joining a Task

1.  **Action:** User clicks "Join Task."
2.  **Request:** Frontend sends a request to update the task data (not implemented yet).
3.  **Database:** Backend updates the task in PostgreSQL (not implemented yet).
4.  **Response:** Backend sends an update message.

#### Logout

1.  **Action:** User clicks "Logout."
2.  **Request:** Frontend sends a POST request to `/logout` with the JWT.
3.  **Token Invalidation:** Backend invalidates the JWT (e.g., deletes it from Redis).
4.  **Response:** Backend sends a success message.

### Code Structure

*   **`src/app`:** Contains all the pages of the application, defining the routes.
    *   `login`: The login page.
    *   `signup`: The signup page.
    *   `dashboard`: The protected page.
    *   `page.tsx`: the main page.
    * `layout.tsx`: the layout of the application.
*   **`src/lib`:** Contains core logic.
    *   `auth.ts`: Authentication-related functions.
    *   `db.ts`: Database connection and interaction logic.
    * `utils.ts`: The utilities functions.
*   **`src/components`:** Reusable UI components.
    * `icons.ts`: The icon components.
    * `ui/*`: The UI components.
*   **`docs`:** Documentation files.
*   **`.idx/`**: The configuration files to configure the dev enviroment.
* **`public`**: public static files.

### Code Examples

#### `src/app/login/page.tsx`
```
typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return(
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Enter your email" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Enter your password" />
                    </div>
                    <Button type="submit">Login</Button>
                </CardContent>
            </Card>
        </div>
    )
}
```
*   **`Card`**, **`CardHeader`**, **`CardContent`**, **`CardTitle`**: Are components to create a card.
*   **`Input`**: A text input component.
*   **`Label`**: A label component.
*   **`Button`**: A button component.

#### `src/lib/auth.ts`
```
typescript
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function createUser(username, email, password) {
  try {
    // Check if user exists
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    // Create user
    const result = await db.query(
      "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, username, email, hashedPassword]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}
```
*   **`db.query`**: Function to interact with the database.
* **`bcrypt.hash`**: Function to hash the password.
* **`uuidv4`**: Function to generate an uuid.

#### `src/lib/db.ts`
```
typescript
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://postgres:password@localhost:5432/postgres",
});

// Database connection logic
export const db = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
};

// ... (rest of the code)
```
*   **`Pool`**: Is used to manage the connection with the database.
*   **`db.query`**: Is the function that interact with the database.

### API and Database Interaction

*   **API Routes:** At the moment the API is not created yet, it is used the route approach, to get to every page.
*   **Database Queries:** The `db.ts` file contains functions that execute SQL queries, to insert, select, update or delete data in the database.

## Part 4: Development Guide

### Setup

1.  **Install Nix:** Follow the instructions on the official Nix website to install Nix on your system.
2.  **Install Node.js:** Ensure you have Node.js installed (the version in `package.json`).
3.  **Clone the Repository:** `git clone <repository_url>`
4.  **Navigate to the Directory:** `cd firebase-studio-app`
5.  **Install Dependencies:** `npm install`

### Running the Project

1.  **Start the Development Server:** `npm run dev`
2.  **Open in Browser:** Go to `http://localhost:3000` in your browser.

### Debugging

*   **Console Logging:** Use `console.log()` to output values to the browser or server console.
*   **Browser Developer Tools:** Use the browser's dev tools (usually opened with F12) to inspect the HTML, CSS, and JavaScript, and to debug errors.
* **Server side debugging:** use the console to see the logs.

### Further Development

*   **Implement API Routes:** Create files in `src/app/api` to add proper API endpoints.
*   **Implement a Task table in the database:** Create a `task` table to store all the tasks in the database.
*   **Add Testing:** Use Jest or another testing framework to write unit and integration tests.
* **Implement the creation and joining the task:** Create the logic to add and join the tasks in the main page.
*   **UI/UX Improvements:** Add features and refine the user interface.

## Part 5: Additional Resources

*   **TypeScript:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
*   **Next.js:** [https://nextjs.org/](https://nextjs.org/)
*   **React:** [https://react.dev/](https://react.dev/)
*   **PostgreSQL:** [https://www.postgresql.org/](https://www.postgresql.org/)
*   **Redis:** [https://redis.io/](https://redis.io/)
*   **bcrypt:** [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)
* **jsonwebtoken:** [https://www.npmjs.com/package/jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* **Nix**: [https://nixos.org/](https://nixos.org/)