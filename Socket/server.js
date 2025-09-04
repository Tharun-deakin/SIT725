// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Import Mongoose

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Enable parsing of JSON request bodies
app.use(express.static(path.join(__dirname, 'view'))); // Serve static files from 'view' directory

let counter = 0;
setInterval(() => {
  counter++;
  io.emit('counter', counter);
}, 1000);

io.on('connection', (socket) => {
  socket.emit('counter', counter); // Send current value on connect
});

// ---------------------------------------------------
// Database Connection and Schema Definition
// ---------------------------------------------------

// MongoDB connection URL.
// If you're using MongoDB Atlas (cloud), replace 'mongodb://localhost:27017/exercise-manager-db'
// with your Atlas connection string (e.g., 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/exercise-manager-db?retryWrites=true&w=majority').
const dbURI = 'mongodb://0.0.0.0:27017/exercise-manager-db';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB successfully! 🎉'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define the schema for an Exercise document
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Exercise name is required
  type: String, // e.g., Cardio, Strength, Mobility
  description: String, // Brief description of the exercise
  duration: Number // Duration in seconds (e.g., 60, 120)
});

// Create a Mongoose Model from the schema.
// Mongoose will automatically create a collection named 'exercises' (plural of 'Exercise').
const Exercise = mongoose.model('Exercise', exerciseSchema);

// ---------------------------------------------------
// API Routes (now interacting with the database)
// ---------------------------------------------------

// GET all exercises
// Fetches all exercise documents from the 'exercises' collection.
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find(); // Find all documents
    res.json(exercises); // Send them as a JSON array
  } catch (err) {
    // If an error occurs during database interaction, send a 500 status with the error message.
    res.status(500).json({ message: err.message });
  }
});

// POST a new exercise
// Creates a new exercise document and saves it to the database.
app.post('/api/exercises', async (req, res) => {
  // Create a new Exercise document instance using the data from the request body
  const newEx = new Exercise({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    duration: req.body.duration
  });

  try {
    const savedEx = await newEx.save(); // Save the new exercise document to MongoDB
    // Respond with the newly created exercise document and a 201 (Created) status code.
    res.status(201).json(savedEx);
  } catch (err) {
    // If validation fails (e.g., 'name' is missing because it's required),
    // or other database errors occur, send a 400 (Bad Request) status with the error message.
    res.status(400).json({ message: err.message });
  }
});

// DELETE an exercise by ID
// Finds an exercise by its unique MongoDB _id and removes it from the database.
app.delete('/api/exercises/:id', async (req, res) => {
  try {
    // Find and delete the exercise by the ID provided in the URL parameters
    const result = await Exercise.findByIdAndDelete(req.params.id);
    if (!result) {
      // If no exercise document was found with the given ID, send a 404 (Not Found) status.
      return res.status(404).json({ message: 'Exercise not found' });
    }
    // If deletion is successful, send a success message.
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    // If a server error occurs during deletion, send a 500 status with the error message.
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------------------------------
// Start the Server
// ---------------------------------------------------
// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

http.listen(3000, () => console.log('Server running at http://localhost:3000'));