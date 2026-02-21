import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/lib/db.js';
import { signup, login, logout, CheckAuth, updateProfile } from '../controllers/auth.controller.js'; 
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js';

import cookieParser from 'cookie-parser';
import { protectRoute } from '../src/middleware/auth.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://dashboard-five-omega-68.vercel.app/', 'http://localhost:5173'], 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// --- AUTHENTICATION ROUTES ---
app.get('/', (req, res) => {
  res.send('Welcome to the API root!');
});
app.post('/signup', signup);
app.post('/login', login);
app.post('/logout', logout);
app.get('/check', protectRoute, CheckAuth);
app.put('/update-profile', protectRoute, updateProfile); 


// --- TASK CRUD ROUTES ---
app.post('/tasks', protectRoute, createTask);         // Create a task
app.get('/tasks', protectRoute, getTasks);            // Get all my tasks
app.put('/tasks/:id', protectRoute, updateTask);      // Update a specific task (by ID)
app.delete('/tasks/:id', protectRoute, deleteTask);   // Delete a specific task (by ID)


// 🧯 Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default async function handler(req, res) {
  try {
    await connectDB(); 
    app(req, res);     
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 🚦 Start server
app.listen(PORT, () => {
  console.log('Server is running on port: ', PORT);
  connectDB();
});