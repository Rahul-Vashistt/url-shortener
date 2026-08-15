# URL Shortener

A full-stack URL shortener built with Node.js, Express, TypeScript, MongoDB, and EJS.

This project was built as a learning project to practice backend development, authentication, authorization, MongoDB/Mongoose, server-side rendering, email-based verification, password recovery, and deployment.

## Live Demo

[Live Demo](https://your-app-name.onrender.com)

> Replace the URL above with the actual Render URL after deployment.

## Features

### URL Shortening
- Create short URLs from valid HTTP and HTTPS URLs.
- Generate unique short IDs with `nanoid`.
- Redirect short URLs to their original destinations.
- Track the number of clicks for each shortened URL.
- Display a user's shortened URLs and basic click statistics.
- Show the most-clicked URL and total click count.

### Authentication
- User registration and login.
- Password hashing with `bcrypt`.
- JWT-based authentication stored in an HTTP-only cookie.
- Email verification after registration.
- Resend verification emails.
- Password reset through a time-limited email link.
- Password reset tokens are hashed before being stored in MongoDB.
- Password reset and verification links expire after 15 minutes.
- Logout functionality.

### Authorization
- Role-based access control.
- `USER` and `ADMIN` roles.
- Protected URL dashboard.
- Admin page with an overview of all shortened URLs and their statistics.
- Unauthorized users receive a dedicated 403 page.

### Error Handling
- Custom 404 page for missing routes and short URLs.
- Custom 403 unauthorized page.
- Custom 500 internal server error page.

### Email
- Verification emails sent with Resend.
- Password reset emails sent with Resend.
- HTML email templates with fallback links.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Template Engine:** EJS
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens
- **Password Hashing:** bcrypt
- **Email:** Resend
- **Short ID Generation:** nanoid
- **Configuration:** dotenv

## Project Structure

```text
src/
├── app.ts
├── server.ts
│
├── config/
│   └── database.ts
│
├── controllers/
│   ├── auth.controller.ts
│   └── url.controller.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── role.middleware.ts
│
├── models/
│   ├── url.model.ts
│   └── user.model.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── page.routes.ts
│   └── url.routes.ts
│
├── services/
│   ├── email.service.ts
│   └── token.service.ts
│
├── types/
│   └── express.d.ts
│
├── utils/
│   └── token.ts
│
└── views/
    ├── admin.ejs
    ├── forgotPassword.ejs
    ├── home.ejs
    ├── internalServerError.ejs
    ├── landing.ejs
    ├── login.ejs
    ├── notFound.ejs
    ├── resetPassword.ejs
    ├── signup.ejs
    ├── unauthorized.ejs
    └── verification.ejs
```

## How It Works

### Authentication Flow

1. A user creates an account.
2. The password is hashed with bcrypt before being stored.
3. A cryptographically secure verification token is generated.
4. Only the hashed version of the verification token is stored in MongoDB.
5. The raw token is sent to the user's email through Resend.
6. The verification link expires after 15 minutes.
7. Once verified, the user can log in.
8. A JWT is created and stored in an HTTP-only cookie.
9. Authentication middleware checks the cookie on subsequent requests.

### Password Reset Flow

1. A user submits their email on the forgot-password page.
2. A secure random token is generated.
3. Only the SHA-256 hash of the token is stored in MongoDB.
4. The raw token is sent through a password reset email.
5. The reset link expires after 15 minutes.
6. The user chooses a new password.
7. The new password is hashed with bcrypt.
8. The reset token and expiry are removed after successful use.

### URL Shortening Flow

1. An authenticated user submits an original URL.
2. The application validates that the URL uses HTTP or HTTPS.
3. An 8-character short ID is generated with `nanoid`.
4. The URL and the authenticated user's ID are stored in MongoDB.
5. The user is redirected to their URL dashboard.
6. Visiting the short URL increments its click count and redirects to the original URL.

## Environment Variables

Create a `.env` file in the project root.

The required variables are:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

BASE_URL=http://localhost:3000

RESEND_API_KEY=your_resend_api_key
```

Use the provided `env.example` file as a reference.

### Production

When deploying to Render, set the environment variables in the Render dashboard rather than committing `.env` to the repository.

In production, `BASE_URL` should point to the deployed application:

```env
BASE_URL=https://your-app-name.onrender.com
NODE_ENV=production
```

Do not commit real credentials, API keys, database connection strings, or JWT secrets.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp env.example .env
```

Then update `.env` with your MongoDB, JWT, and Resend credentials.

## Development

Start the application in development mode:

```bash
npm run dev
```

The development script uses `tsx` with watch mode and runs:

```text
src/server.ts
```

## Production Build

Compile the TypeScript source:

```bash
npm run build
```

The compiled JavaScript is generated in:

```text
dist/
```

Start the compiled application:

```bash
npm start
```

The production start command runs:

```text
node dist/server.js
```

## MongoDB

This application uses MongoDB through Mongoose.

You can use a MongoDB Atlas cluster for a hosted database. Add the connection string to:

```env
MONGO_URI=your_mongodb_connection_string
```

The application connects to MongoDB during server startup. If the connection fails, the server exits.

## Resend

Email verification and password reset emails are sent through Resend.

Set your API key in:

```env
RESEND_API_KEY=your_resend_api_key
```

The email service currently uses Resend's configured sender address. For production use with a custom domain, configure and verify a sending domain in Resend and update the sender address accordingly.

## Deployment

This project is configured to work as a Render Web Service.

### Render settings

Use the following commands:

```text
Build Command:
npm run build

Start Command:
npm start
```

Add the required environment variables in Render.

For example:

```env
NODE_ENV=production
BASE_URL=https://your-app-name.onrender.com
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
RESEND_API_KEY=your_resend_api_key
```

Render provides the `PORT` environment variable for the web service, and the application reads it in `server.ts`.

After deployment, update `BASE_URL` to the final Render URL so that verification emails, password reset emails, and generated short URLs use the production address.

## Security Notes

The project includes several security-oriented practices:

- Passwords are hashed with bcrypt.
- JWTs are stored in HTTP-only cookies.
- Authentication cookies use `secure` in production.
- Verification and password reset tokens are stored as hashes rather than raw tokens.
- Verification and reset tokens have a 15-minute expiry.
- Password reset requests return the same pending response whether or not an account exists, reducing account enumeration through the response.
- Internal server errors are logged on the server while users receive a generic error page.
- `.env`, `node_modules`, and `dist` are excluded through `.gitignore`.

This project is intended as a learning project and should receive additional security hardening before being used as a production authentication service.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with `tsx` watch mode |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Start the compiled production server |

## Routes

### Public Pages

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Landing page or redirect to the dashboard |
| GET | `/user/login` | Login page |
| POST | `/user/login` | Authenticate a user |
| GET | `/user/signup` | Signup page |
| POST | `/user/signup` | Create an account |
| GET | `/user/verify-email` | Verify an email address |
| POST | `/user/resend-verification` | Resend verification email |
| GET | `/user/forgot-password` | Forgot password page |
| POST | `/user/forgot-password` | Request password reset |
| GET | `/user/reset-password` | Password reset page |
| POST | `/user/reset-password` | Change password |
| GET | `/user/logout` | Log out |

### Authenticated Pages

| Method | Route | Description |
| --- | --- | --- |
| GET | `/url` | User URL dashboard |
| POST | `/url` | Create a shortened URL |
| GET | `/url/:shortId` | Redirect to the original URL |

### Admin

| Method | Route | Description |
| --- | --- | --- |
| GET | `/admin` | Admin dashboard |

## Error Pages

The application includes dedicated EJS pages for common HTTP errors:

- `404` — Page or short URL not found.
- `403` — Authenticated user does not have permission to access a resource.
- `500` — Unexpected server-side error.

## License

This project was created as a learning project. No specific open-source license has been defined yet.
