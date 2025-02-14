# Backend Authentication API

## Overview
This is a backend authentication API built using Node.js and Express. It provides user registration, login, OTP verification, and password reset functionalities.

## Base URL
```
https://auth-e342.onrender.com/api/v1/
```

## API Endpoints

### 1. User Registration
- **Endpoint:** `/register`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword"
  }
  ```
- **Description:** Registers a new user with email, name, and password.

### 2. User Login
- **Endpoint:** `/login`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Description:** Authenticates a user and returns an access token.

### 3. OTP Verification
- **Endpoint:** `/verify-otp`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Description:** Verifies the OTP sent to the user's email.

### 4. Request Password Reset
- **Endpoint:** `/request-password-reset`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Description:** Sends a password reset OTP to the user's email.

### 5. Reset Password
- **Endpoint:** `/reset-password`
- **Method:** `POST`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "password": "newsecurepassword"
  }
  ```
- **Description:** Resets the user's password using OTP verification.

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd backend-authentication
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add the required environment variables.
5. Start the server:
   ```sh
   npm start
   ```

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Author
- **Ayush**

## License
This project is licensed under the MIT License.

