# API Learning 

A learning project building a REST API with authentication and authorization.
I am making this without any idea, just trying to code the API logic🥲. 

## Tech Stack
- **Backend**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT tokens
- **Security**: bcrypt for password hashing
- **Other**: CORS, dotenv

---

## Devlog

### Session 1: Foundation
**Date**: Jan 9, 2026

**Learning**:
- Set up Express server with MongoDB connection
- Implemented user authentication (register/login)
- Added JWT token generation
- Used bcrypt for password hashing

**Endpoints Completed**:
- `GET /api/movies` - Fetch all movies
- `GET /api/movies/:name` - Search movies by title
- `POST /api/register` - Register new user
- `POST /api/login` - Login and get JWT token
- `POST /api/add-movie` - Add movie (admin only)

**Database Models**:
- User (username, password, role)
- Movie (title, year, rating, genre, director)

**Next**: Delete, update, and get endpoints

---

### Session 2: Delete, Users & Profile
**Date**: Jan 10, 2026

**Learning**:
- Delete operations with MongoDB `deleteOne()`
- Decoding JWT tokens without verification using `jwtDecode`
- Input validation (required fields)
- Using `.select()` to exclude/include fields from queries
- Error handling with try-catch blocks
- Different token extraction patterns

**Endpoints Added**:
- `DELETE /api/delete-movie/:name` - Delete movie (admin only)
- `GET /api/get-users` - List all registered users (admin only)
- `GET /api/get-profile` - Get current user profile info

--- 

## Current Status
- ✅ Auth system working
- ✅ Movie CRUD read
- ⏳ Movie CRUD delete/update
- ✅ User profile endpoint
- ⏳ Input validationusing Zod module

## Notes
- Using `verifyToken` middleware for admin-only routes
- Token expiry set to 1 hour
- Need to add more error handling
