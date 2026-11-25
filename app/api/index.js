// Vercel serverless entry: all /api/* requests are rewritten here (see vercel.json).
// Uses the server compiled by `tsc -p tsconfig.server.json` (see buildCommand).
module.exports = require('../dist/server/app').default;
