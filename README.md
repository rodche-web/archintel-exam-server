﻿# Writer/Editor Dashboard Backend

This is a backend application built using Node.js and Express.js to support a **Writer/Editor Dashboard**. The application allows users to create, edit, and publish articles related to a company. The backend provides APIs to manage articles, handle authentication, and enable user roles (e.g., writers and editors).

---

## Features

- **User Authentication**: Secure user login and session management.
- **Article Management**: APIs to create, update, delete, and publish articles.
- **User Roles**:
  - **Writers**: Can draft and edit articles.
  - **Editors**: Can review and publish articles.
- **Data Persistence**: Connects to a database to store user and article data.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework.
- **Database**: MongoDB.
- **Authentication**: JWT.
- **Environment Management**: dotenv for configuration management.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js installation
- **Database**: Ensure your database (MongoDB) is running

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rodche-web/archintel-exam-server.git
cd archintel-exam-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
ORIGIN_URL=http://localhost:5173
MONGODB_URI=your-database-url
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_ACCESS_EXPIRATION=30m
JWT_REFRESH_EXPIRATION=7d
S3_SECRET_ACCESS_KEY=s3-access-key
S3_ACCESS_KEY_ID=s3-key-id
```

### 4. Start the Application

#### For Development:

```bash
npm run dev
```

#### For Production:

```bash
npm start
```

The server will start running on `http://localhost:8000` (or the port specified in the `.env` file).

---

## API Endpoints

### Authentication
- `POST /api/auth/login`: Log in a user.
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/refresh-token`: Fetch a new access token.
- `POST /api/auth/logout`: Log out a user.

### Articles
- `GET /api/article`: Fetch all articles.
- `GET /api/article/:id`: Fetch a single article.
- `POST /api/article`: Create a new article.
- `PUT /api/article/:id`: Edit an existing article.
- `DELETE /api/article/:id`: Delete an article.

### Companies
- `GET /api/company`: Fetch all companies.
- `GET /api/company/:id`: Fetch a single company.
- `POST /api/company`: Create a new company.
- `PUT /api/company/:id`: Edit an existing company.
- `DELETE /api/company/:id`: Delete an company.

### Users
- `GET /api/user`: Fetch all users.
- `GET /api/user/:id`: Fetch a single user.
- `PUT /api/user/:id`: Edit an existing user.
- `DELETE /api/user/:id`: Delete an user.
- `GET /api/user/me/profile`: Fetch user profile.
- 
### File
- `GET /api/file/upload`: Fetch a signed URL from S3.



