const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const cacheMiddleware = require('./middleware/cache');
const dotenv = require('dotenv');
const os = require('os');
const cluster = require('cluster');

// Load env variables
dotenv.config();

// Create express app
const app = express();

// Connect to DB
connectDB();

// === Security Middleware ===
app.use(helmet());

// === CORS Middleware ===
// For dev: use origin: true
// For prod: use whitelist method (recommended)
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.197.171:3000',
  'https://your-frontend.vercel.app' // Replace with actual deployed frontend
];

app.use(cors({
<<<<<<< HEAD
  origin: '*',
=======
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
>>>>>>> a2bc362bf6e242d79b5b01710d9eb7e706506560
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// === Performance Middleware ===
app.use(compression()); // gzip all responses
app.use(express.json({ extended: false }));

// === Rate Limiting Middleware ===
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// === Routes with Optional Caching ===
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/universities', cacheMiddleware(300), require('./routes/universities')); // cache for 5 min

// === 404 Route Handler ===
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// === Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// === Start Server (Clustered in Production) ===
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  if (cluster.isPrimary) {
    console.log(`[Master ${process.pid}] Running in cluster mode`);
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`[Worker ${worker.process.pid}] Died. Spawning replacement...`);
      cluster.fork();
    });
  } else {
    app.listen(PORT, () => {
      console.log(`[Worker ${process.pid}] Server running on port ${PORT}`);
    });
  }
} else {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
