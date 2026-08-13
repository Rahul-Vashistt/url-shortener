# URL Shortener

A full-stack URL shortener built with **Node.js, Express, TypeScript, MongoDB, Mongoose, and EJS**.

The application allows users to create shortened URLs, track their clicks, view their URL analytics, and provides an admin dashboard with role-based access control.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Authentication using HTTP-only cookies
- Role-based authorization
- User and admin roles
- Create shortened URLs
- Public short URL redirection
- Click tracking
- User-specific URL analytics
- Admin dashboard
- View URL ownership through Mongoose population
- URL creation timestamps
- Server-rendered UI using EJS

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt
- HTTP-only cookies
- Role-based authorization

### Frontend

- EJS
- HTML
- CSS
- JavaScript

### Other

- nanoid

## Project Structure

```text
src/
├── config/
│   └── database.ts
├── controllers/
│   ├── auth.controller.ts
│   └── url.controller.ts
├── middlewares/
│   └── auth.middleware.ts
├── models/
│   ├── url.model.ts
│   └── user.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── page.routes.ts
│   └── url.routes.ts
├── services/
│   └── auth.service.ts
├── types/
│   └── express.d.ts
├── views/
│   ├── admin.ejs
│   ├── home.ejs
│   ├── landing.ejs
│   ├── login.ejs
│   └── signup.ejs
└── app.ts
```

> Some directories may contain additional files as the project continues to be developed.

## How It Works

### Authentication

When a user logs in successfully, the server creates a JWT containing the user's ID.

The token is stored in an HTTP-only cookie.

On subsequent requests:

```text
Request
   ↓
Authentication Middleware
   ↓
Read JWT from Cookie
   ↓
Verify JWT
   ↓
Find User
   ↓
Attach User to req.user
   ↓
Continue Request
```

### Role-Based Authorization

Protected routes use role-based middleware.

For example:

```ts
restrictToRole(["ADMIN"])
```

only allows users with the `ADMIN` role to access the route.

Regular users can access their own URL dashboard, while administrators can access the admin dashboard.

### URL Shortening

When a user submits a valid URL:

```text
Original URL
     ↓
Generate unique short ID
     ↓
Save URL + short ID + creator
     ↓
Display shortened URL
```

Example:

```text
Original:
https://www.example.com/some/very/long/url

Short:
http://localhost:3000/url/abc12345
```

### URL Redirection

Short URLs are publicly accessible.

```text
GET /url/:shortId
        ↓
Find URL
        ↓
Increase click count
        ↓
Redirect to original URL
```

Authentication is not required for public short URL redirects.

## Analytics

Each shortened URL stores its click count.

Users can view:

- Total URLs created
- Total clicks
- Most-clicked URL
- Individual URL click counts
- URL creation dates

Administrators can view URL information across the application.

## Environment Variables

Create a `.env` file in the root of the project:

```env
MONGO_URI=mongodb://127.0.0.1:27017/v2urlshortener
JWT_SECRET=your_jwt_secret_here
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |

> Never commit your `.env` file to GitHub.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate into the project

```bash
cd <project-folder>
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your environment file

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/v2urlshortener
JWT_SECRET=your_jwt_secret_here
```

### 5. Start MongoDB

Make sure your MongoDB server is running locally or provide a valid MongoDB connection string through `MONGO_URI`.

### 6. Start the application

Use the development script configured in `package.json`.

For example:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Main Routes

### Public Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Landing page |
| `GET` | `/url/:shortId` | Redirect to original URL |
| `GET` | `/user/login` | Login page |
| `GET` | `/user/signup` | Signup page |

### Authentication Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/user/signup` | Create a new account |
| `POST` | `/user/login` | Log in |
| `GET` | `/user/logout` | Log out |

### Protected Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/url` | User URL dashboard |
| `POST` | `/url` | Create a shortened URL |

### Admin Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/admin` | Admin dashboard |

## Database Models

### User

A user contains information such as:

```text
fullName
username
email
password
role
createdAt
updatedAt
```

The password is stored as a bcrypt hash rather than plaintext.

Users have a role such as:

```text
USER
ADMIN
```

### URL

A shortened URL contains:

```text
originalUrl
shortId
clicks
createdBy
createdAt
updatedAt
```

`createdBy` references the corresponding User document.

Mongoose `populate()` is used where necessary to retrieve information about the URL owner.

## Security

The application currently uses:

- bcrypt for password hashing
- JWT for authentication
- HTTP-only cookies for storing authentication tokens
- Role-based route protection
- Environment variables for secrets
- Server-side URL validation
- MongoDB references between users and URLs

Sensitive environment variables are excluded from version control using `.gitignore`.

## Git Ignore

The following files/directories are intentionally excluded from Git:

```gitignore
node_modules/
dist/
.env
```

The actual `.env` file should never be committed because it contains secrets.

An `.env.example` file can be included in the repository to document the required environment variables without exposing their actual values.

## Future Improvements

Some features that may be added in future versions:

- Custom short IDs
- URL expiration
- QR code generation
- Better URL validation
- Advanced analytics
- Click history and timestamps
- Pagination for URL lists
- Search and filtering
- Rate limiting
- Password reset
- Email verification
- Improved error handling
- API endpoints
- Production deployment
- Automated tests

## Status

This project is currently under active development and serves as a learning project for building backend applications with **TypeScript, Express, MongoDB, authentication, authorization, and server-side rendering**.

## License

This project is currently for educational and personal use.
