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

// The upgraded randomizer that listens for difficulty!
app.get('/random', async (req, res) => {
  try {
    let matchStage = {}; // Default: Mixed (Any rating)
    const diff = req.query.difficulty;
    
    // Sort by rating based on what the app asks for
    if (diff === 'easy') {
      matchStage = { Rating: { $lt: 1500 } };
    } else if (diff === 'medium') {
      matchStage = { Rating: { $gte: 1500, $lte: 2000 } };
    } else if (diff === 'hard') {
      matchStage = { Rating: { $gt: 2000 } };
    }

    const puzzle = await Puzzle.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);
    
    if (puzzle.length > 0) {
      res.json(puzzle[0]);
    } else {
      res.status(404).json({ error: "No puzzles found for this difficulty!" });
    }
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}!`);
});

