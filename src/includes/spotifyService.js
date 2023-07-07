import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Set your Spotify API credentials
const clientId = '99e18dceec0e44a1b6fb9fd0b9596685';
const redirectUri = `${window.location.href}callback`;

// Set the desired Spotify scopes
const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify',
];

// Function to authorize the user
const authorizeUser = () => {
  const state = generateRandomString(16);

  // Save the state to session storage for verification later
  sessionStorage.setItem('spotify_auth_state', state);

  // Create the authorization URL
  const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scopes.join(' '))}`;

  // Redirect the user to the authorization URL
  window.location.href = authorizeURL;
};

// Function to generate a random string
const generateRandomString = (length) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

// Function to parse the access token and other parameters from the URL hash
const parseUrlHash = () => {
  const hash = window.location.hash.substring(1);
  const hashParams = {};

  const regex = /([^&;=]+)=?([^&;]*)/g;
  let match;
  while ((match = regex.exec(hash))) {
    hashParams[match[1]] = decodeURIComponent(match[2]);
  }

  return hashParams;
};

// Function to handle the callback and retrieve the access token
const handleCallback = () => {
  const hashParams = parseUrlHash();

  // Verify the state parameter to prevent cross-site request forgery attacks
  const storedState = sessionStorage.getItem('spotify_auth_state');
  sessionStorage.removeItem('spotify_auth_state');
  const state = hashParams.state;

  if (state === null || state !== storedState) {
    // console.error('Authorization failed. State mismatch.')
    return;
  }

  const accessToken = hashParams.access_token;
  // const expiresIn = parseInt(hashParams.expires_in)
  // const tokenType = hashParams.token_type

  // Set the access token on the Spotify API instance
  spotifyApi.setAccessToken(accessToken);

  // Optionally, you can store the access token and other details in your application's state or local storage
  // ...

  // Perform any necessary operations after successful authorization
  // ...

  // save apiToken to localStorage
  sessionStorage.setItem('access_token', accessToken);
};

export { authorizeUser, handleCallback, spotifyApi };
