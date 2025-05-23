import express from 'express';
import studioRouter from './routes/studioRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/api/v1/studios', studioRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all(/.*/, (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Não foi possível encontrar ${req.originalUrl} neste servidor!`,
  });
  next();
});

export default app;
