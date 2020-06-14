import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

import accessEnv from './util/accessEnv';
import setupRoutes from './routes';

const PORT = accessEnv('PORT', 7000);

const app = express();

app.use(json());

// Whitelist or Blacklist origins here accorfingly. Right now allowing all to pass through
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

// Set all the routes for the app
setupRoutes(app);

// Handle error in this route,
// This can also improved by having a common module which will handle all type of errors,
// As a result it'll bring consistency to all other services we might use (for Microservices)
app.use((err, req, res, next) => {
  const { message, status } = err;

  return res
    .json({
      message,
    })
    .status(status);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listings service listening on PORT = ${PORT}`);
});
