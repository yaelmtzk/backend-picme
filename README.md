backend-picme

Simple backend for the PicMe application (Express.js). Provides authentication, user and story APIs, and integrates with services such as Cloudinary and a database service.

**Status:** Development

**Tech:** Node.js, Express, MongoDB (or other DB via `services/db.service.js`), Cloudinary

**Quick Start**

- Install dependencies:

  npm install

- Copy or create an environment file (see "Environment") and set required vars.

- Start the server in development:

  npm run start


**Environment**

The app reads configuration from environment variables and `config/*.js`. Common variables to set:

- `PORT` — server port (default 3000)
- `NODE_ENV` — `development` or `production`
- `DB_CONN` or `MONGO_URI` — database connection string (used by `services/db.service.js`)
- `CLOUDINARY_URL` or related Cloudinary keys — for image uploads (used by `services/cloudinary.service.js`)
- Any auth secret(s) used by `auth` service (JWT secret, etc.)

Adjust values in `config/dev.js` and `config/prod.js` as needed for environment-specific settings.


**Project Structure (selected)**

- `server.js` — app entry
- `api/` — route definitions and controllers
  - `auth/` — `auth.routes.js`, `auth.controller.js`, `auth.service.js`
  - `user/` — `user.routes.js`, `user.controller.js`, `user.service.js`
  - `story/` — `story.routes.js`, `story.controller.js`, `story.service.js`
- `config/` — environment configuration files
- `services/` — shared services (`db.service.js`, `cloudinary.service.js`, `logger.service.js`, `socket.service.js`, etc.)
- `middlewares/` — middlewares (auth, logging, ALS setup)
- `public/` — static frontend and client-side services


**Available Scripts**

- `npm run start` — start the server (check `package.json` for exact scripts)
- `npm run dev` — start with nodemon (if configured)


**API Overview**

This backend exposes routes grouped under `auth`, `user`, and `story`. Typical endpoints include:

- `POST /auth/login` — authenticate user and return token
- `POST /auth/signup` — register new user
- `GET /user/:id` — fetch user details
- `POST /story` — create a story (protected)
- `GET /story` — list stories

Refer to the route files in `api/` for exact endpoints and request/response shapes.


**Logging & Middleware**

- Request logging is handled by `middlewares/logger.middleware.js` and `services/logger.service.js`.
- Authentication protection uses `middlewares/requireAuth.middleware.js` and `auth.service.js`.
- ALS (Application-level statistics) setup is available via `middlewares/setupAls.middleware.js` and `services/als.service.js`.


**Development Notes**

- Keep secrets out of source control — use environment variables or a secrets manager.
- Cloudinary integration is optional — if not used, blacklist or stub `cloudinary.service.js` to avoid errors.
