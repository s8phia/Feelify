const express = require('express');
const cors = require('cors');
const app   = express();
app.use(cors());
app.use(express.json());

const clientId = '93f0a39ae4d34f7a80fcc3cde2227940';
const clientSecret = '1c260af380ec4980b57a6fe54b4c815b';

const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await result.json();
    return data.access_token;
}

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