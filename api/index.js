// Vercel serverless entry point
// DATABASE_URL and JWT_SECRET should be set in Vercel Environment Variables
const app = require('../backend/src/app');

module.exports = app;
