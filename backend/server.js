const express = require('express');
const cors = require('cors');
const app   = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const clientId = process.env.clientID ;
const clientSecret = process.env.clientSecretID;

const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await result.json();
    return data.access_token;
}

const searchGenreByPlaylist = async (token, genre) => {
    const query = encodeURIComponent(genre); 
    console.log(`Searching Spotify for playlists with query: ${query}`);
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist`
        , {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    });
    const data = await result.json();

    if(!data.playlists || !data.playlists.items){
        console.log('No playlists found');
        return null;
    }

    const validPlaylists = data.playlists.items.filter(item => item!=null);

    if(validPlaylists.length === 0){
        console.log('No valid playlists found');
        return null;
    }

    console.log(`Found ${validPlaylists.length} playlists`);
    return validPlaylists;

}


const searchTracks = async (token, playlistIDs) => {
    const allTracks = [];
    for(const playlistID of playlistIDs) {
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?`, {  
            method: 'GET',           
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });
        const data = await result.json();
        if(data.items){
            const tracks = data.items
            .filter(item => item && item.track)
            .map(item => {
                return {
                    name: item.track.name,
                    artist: item.track.artists.map(a => a.name).join(', '),
                    url: item.track.external_urls.spotify,
                    preview: item.track.preview_url,
                    image: item.track.album.images[0]?.url || null,
                };
            });
            allTracks.push(...tracks);
        } else {
            console.log('No tracks found in playlist');
        }
    }
    console.log(`Fetched ${allTracks.length} tracks from playlists`);
    //get five random songs friom allTracks
    return allTracks.sort(() => Math.random() - Math.random()).slice(0, 5);

};


app.get( '/', (req, res) => {
    res.send("hello world from node.js server")
});

app.post('/api/recommend', async (req, res) => {
    try {
        const mood = req.body.mood;
        console.log(`Received mood: ${mood}`);
        
        // Fetch Spotify token
        const token = await _getToken();
        console.log(`Token received: ${token}`);
        
        // Search for a playlist based on mood
        const playlist = await searchGenreByPlaylist(token, mood);
        console.log(`Playlist found: ${playlist ? playlist.name : 'None'}`);
        
        // fetch plauylist ids
        const playlistIDs = playlist.map(item => item.id);
        console.log(`Playlist IDs: ${playlistIDs.join(', ')}`);

        // Search for tracks in the playlist
        const songs = await searchTracks(token, playlistIDs);
        console.log(`Songs fetched: ${songs.length}`);
        
        res.json({ songs });
    } catch (error) {
        console.error('Error in /api/recommend:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

app.listen( 3000, () => {
    console.log( "server is running on port 3000" );
});