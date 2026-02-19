const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Allow your TrebEdit website to talk to this server
app.use(cors());

// Your specific MongoDB database link
const MONGO_URI = "mongodb+srv://chessindia864:jpgnJOBM8AaiWSDl@chessindiacom.ypq2yqg.mongodb.net/ChessData?appName=Chessindiacom";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Database Connected!"))
  .catch(err => console.error("❌ Connection Error:", err));

// Tell the server what the puzzle data looks like
const Puzzle = mongoose.model('Puzzle', new mongoose.Schema({
  PuzzleId: String, 
  FEN: String, 
  Moves: String, 
  Rating: Number, 
  Themes: String
}), 'puzzles');

// When the game asks for a random puzzle, send one!
app.get('/random', async (req, res) => {
  try {
    const puzzle = await Puzzle.aggregate([{ $sample: { size: 1 } }]);
    res.json(puzzle[0]);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// Render gives the server a specific port, so we use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}!`);
});
