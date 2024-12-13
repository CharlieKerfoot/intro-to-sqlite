# API Endpoints

## 1. Get user by ID

- **Endpoint**: `/user/:id`
- **Method**: GET
- **Description**: Retrieves a user by their ID.
- **Response**:
    - 200: `{ "id": 1, "name": "foo" }`
    - 404: `User not found`

## 2. Get all users

- **Endpoint**: `/all-users`
- **Method**: GET
- **Description**: Retrieves all users.
- **Response**:
    - 200: `[{ "id": 1, "name": "foo" }, ...]`
    - 404: Invalid input

## 3. Create user

- **Endpoint**: `/user/:id`
- **Method**: POST
- **Description**: Creates a new user.
- **Request Body**:
  ```json
  {
    "name": "foo"
  }
- **Response**:
    - 201: `{ message: User Successfully Created }`
    - 400: `Incorrect Parameters`
    - 404: `User not found`

## 4. Update user

- **Endpoint**: `/users/:id`
- **Method**: PUT
- **Description**: Updates user.
- **Request Body**:
  ```json
  {
    "name": "foo"
  }
- **Response**:
    - 200: `{ message: User Successfully Updated }`
    - 400: `Incorrect Parameters`
    - 404: `User not found`
    - 500: `Internal Server Error`

## 5. Delete user

- **Endpoint**: `/users/:id`
- **Method**: DELETE
- **Description**: Deletes user.
- **Response**:
    - 200: `{ message: User Successfully Updated }`
    - 404: `User not found`
    - 500: `Internal Server Error`

