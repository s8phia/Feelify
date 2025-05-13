const express = require('express');
const cors = require('cors');
const app   = express();
app.use(cors());
app.use(express.json());

app.get( '/', (req, res) => {
    res.send("hello world from node.js server")
});

app.post('/api/recommend', (req, res) => {
    const mood = req.body.mood;
    console.log(`Received mood: ${mood}`);
    const recommendations = {
        happy: ["Song 1", "Song 2", "Song 3"],
        sad: ["Song 4", "Song 5", "Song 6"],
        angry: ["Song 7", "Song 8", "Song 9"],
    };
    const songs = recommendations[mood] || [];
    res.json({ songs });
});

app.listen( 3000, () => {
    console.log( "server is running on port 3000" );
});