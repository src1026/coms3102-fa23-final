// importing required modules
const express = require("express");
const { Schema, model, connect } = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// creating an Express app
const app = express();

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to enable CORS
app.use(cors());

// getting MongoDB connection string from environment variables
const mongoDBUri = process.env.MONGODB_URI;

// connecting to MongoDB
connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Successfully connected to MongoDB")) 
.catch(err => console.error("Connection error", err)); 

// defining a schema for the "Note" model
const noteSchema = new Schema({
  title: String,
  body: String
});

// creating the "Note" model
const Note = model("Note", noteSchema);

// creating a router for our routes
const router = express.Router();

// GET route for fetching all notes
router.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find(); // Fetching all notes
    res.json(notes); // Sending the notes as a JSON response
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve notes" }); // Sending error message
  }
});

// POST route for creating a new note
router.post("/api/notes", async (req, res) => {
  try {
    const newNote = new Note(req.body); // Creating a new note
    await newNote.save(); // Saving the note to the database
    res.status(201).json({ message: "Note created successfully" }); // Sending success message
  } catch (err) {
    res.status(500).json({ message: "Failed to create note" }); // Sending error message
  }
});

// using our router
app.use('/', router);

// getting the port from environment variables or defaulting to 3000
const PORT = process.env.PORT || 3000;

// starting the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));