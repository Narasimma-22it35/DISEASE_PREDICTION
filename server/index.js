const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const connectDB = require('./config/db');

// Route files
const auth = require('./routes/auth');
const upload = require('./routes/upload');
const analyze = require('./routes/analyze');
const healthplan = require('./routes/healthplan');
const history = require('./routes/history');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// App Settings
app.set('io', io);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Set security headers
app.use(helmet({
    crossOriginResourcePolicy: false, // For local image serving if needed
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/upload', upload);
app.use('/api/analyze', analyze);
app.use('/api/healthplan', healthplan);
app.use('/api/history', history);

// Basic Route
app.get('/', (req, res) => {
  res.send('HealthGuard AI API is running...');
});

// Socket.io initialization
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Multer and Global Error Handler Middleware
app.use((err, req, res, next) => {
  // Catch Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max limit is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  // Handle other errors
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
