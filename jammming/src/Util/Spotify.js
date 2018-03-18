const client_id = '64c11b00e3f648ff8f68fda5600209d1'; // Your client id
const redirect_uri = 'http://localhost:3000/'; // Your redirect uri
//http://localhost:3000/
//http://SUSAN_JAMMMING.surge.sh
let accessToken;
let expiresIn;
const Spotify = {
  getAccessToken() {
    let url = window.location.href;
    if (accessToken) {
      return accessToken;
    }

    if (url.match(/access_token=([^&]*)/) &&
    url.match(/expires_in=([^&]*)/)) {
        let token = url.match(/access_token=([^&]*)/);
        token = token[0];
        accessToken = token.substring(13, token.length)
        let expirationTime = url.match(/expires_in=([^&]*)/);
        expirationTime = expirationTime[0];
        expiresIn = expirationTime.substring(11, expirationTime.length);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }

    if (!accessToken) {
        window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
      }

  },

  search(term) {
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
      return response.json();
    }).then(jsonResponse => {
    if (jsonResponse.tracks) {
    return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))};
  });
},

  savePlaylist(name, trackURIs) {
    if (name && trackURIs) {
      console.log('yes');
    } else {
      return
    }
    let token = accessToken;
    let headers = {Authorization: `Bearer ${token}`};
    let id = '';
    fetch('https://api.spotify.com/v1/me',
      {
        headers: headers
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        id = jsonResponse.id
      });
    let playlistID = '';
    fetch(`https://api.spotify.com/v1/users/${id}/playlists`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: name})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id
      });
    fetch(`https://api.spotify.com/v1/users/${id}/playlists/${playlistID}/tracks`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({uris: trackURIs})
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      playlistID = jsonResponse.id
    })
  }
}



export default Spotify;
