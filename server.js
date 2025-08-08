// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data (resets when server restarts)
let exercises = [
  { id: 1, name: 'Air Squat', type: 'Mobility', description: 'Basic squat exercise', duration: 30 },
  { id: 2, name: 'CO2 Table', type: 'Breathing', description: 'Breathing CO2 tolerance', duration: 120 }
];

// API routes
app.get('/api/exercises', (req, res) => {
  res.json(exercises);
});

app.post('/api/exercises', (req, res) => {
  const newEx = { id: Date.now(), ...req.body };
  exercises.push(newEx);
  res.status(201).json(newEx);
});

app.delete('/api/exercises/:id', (req, res) => {
  exercises = exercises.filter(ex => ex.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));