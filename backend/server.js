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

const searchGenreByPlaylist = async (token, genre) => {
    const query = encodeURIComponent(genre); //encode the genre for URL 
    const result = await fetch('https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=1`', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    });
    const data = await result.json();
    
    if(!data.playlists || !data.playlists.items.length){
        return null;
    }
    return data.playlists.items[0];
}

const searchTracks = async (token, playlistID) => {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=5`, {  
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    });
    const data = await result.json();
    const tracks = data.items.map(item => {
        return {
            name: item.track.name,
            artist: item.track.artists.map(a => a.name).join(', '),
            url: item.track.external_urls.spotify,
            preview: item.track.preview_url,
            image: item.track.album.images[0].url,
        };
    });
    return tracks;
};


app.get( '/', (req, res) => {
    res.send("hello world from node.js server")
});

app.post('/api/recommend', async (req, res) => {
    const mood = req.body.mood;
    console.log(`Received mood: ${mood}`);
    const token = await _getToken();
    const playlist = await searchGenreByPlaylist(token, mood);
    const songs = playlist ? await searchTracks(token, playlist.id) : recommendations[mood] || [];
    res.json({ songs });
});

app.listen( 3000, () => {
    console.log( "server is running on port 3000" );
});