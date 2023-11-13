# Trade Analysis Backend Documentation

## Technologies Used

The Trade Analysis Backend is built using the following technologies:

- **Express**: A fast, unopinionated, minimalist web framework for Node.js.
- **HTTP Status**: A library to provide easy access to HTTP status codes.
- **JSON Web Token (jsonwebtoken)**: A standard for securing web connections using JSON tokens.
- **Mongoose**: An elegant MongoDB object modeling for Node.js.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **TypeScript**: A superset of JavaScript that adds static typing to the language.
- **ESLint**: A tool for identifying and fixing code style issues in JavaScript and TypeScript.

## Live Link

[Trade Analysis Backend API](https://trade-analysis-backend.vercel.app/api/v1)

## Authentication Routes

### `/auth/login` (POST)

- **Description**: User login route.
- **Request Body**:
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response**:
  - `token` (string): JWT token for authentication.

### `/auth/register` (POST)

- **Description**: User registration route.
- **Request Body**:
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response**:
  - `message` (string): Registration success message.

### `/auth/verify-email` (POST)

- **Description**: Verify user email route.
- **Request Body**:
  - `token` (string): Token received during registration.
- **Response**:
  - `message` (string): Email verification success message.

### `/auth/refresh-token` (POST)

- **Description**: Refresh user JWT token route.
- **Request Headers**:
  - `Authorization` (string): Bearer token.
- **Response**:
  - `token` (string): Refreshed JWT token.

### `/auth/logout` (POST)

- **Description**: User logout route.
- **Request Headers**:
  - `Authorization` (string): Bearer token.
- **Response**:
  - `message` (string): Logout success message.

## Data Routes

### `/data` (GET)

- **Description**: Get trade data route.
- **Request Headers**:
  - `Authorization` (string): Bearer token.
- **Response**:
  - Array of trade data.

### `/data` (POST)

- **Description**: Add new trade data route.
- **Request Headers**:
  - `Authorization` (string): Bearer token.
- **Request Body**:
  - `symbol` (string): Trade symbol.
  - `quantity` (number): Trade quantity.
  - `price` (number): Trade price.
- **Response**:
  - `message` (string): Trade data added successfully message.

# Trade-Analysis-Backend
# Trade-Analysis-Backend
# Trade-Analysis-Backend
# Trade-Analysis-Backend
# Trade-Analysis-Backend
