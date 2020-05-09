const api = require('../api');
const db = require('../../../db');
const { logAndReturnError } = require('../../logger');

/*
* Actual work goes here
*/
async function updateTokens({ oldTokens, newTokens }) {
  var spotifyUser = await db.models.SpotifyUser.findOne({ where: oldTokens });
  if (spotifyUser) {
    spotifyUser = await spotifyUser.update(newTokens);
  }
  return spotifyUser;
}

function getPlayolaUserSeed({ accessToken, refreshToken }) {
  return new Promise((resolve, reject) => {
    api.getMe({ accessToken, refreshToken })
      .then(profile => resolve(playolaProfileFromSpotifyProfile(profile)))
      .catch(err => reject(logAndReturnError(err)));
  });
}

/*
* A User is automatically created anytime a SpotifyUser is created.
*/
async function createSpotifyUserAndUser({ accessToken, refreshToken }) {
  let spotifyUser = await db.models.SpotifyUser.findOne({ where: { refreshToken } });
  // If the user already exists, just update the accessToken and you're done
  if (spotifyUser) {
    if (accessToken) {
      spotifyUser.accessToken = accessToken;
      await spotifyUser.save();
    }
    let user = await db.models.User.findOne({ where: { id: spotifyUser.userID } });
    return { user, spotifyUser };  
  }
  let rawProfile = await api.getMe({ accessToken, refreshToken });
  let user = await db.models.User.create(playolaProfileFromSpotifyProfile(rawProfile));
  spotifyUser = await db.models.SpotifyUser.create({ 
    accessToken, 
    refreshToken, 
    userID: user.id, 
    spotifyUID: rawProfile['id']
  });
  return { user, spotifyUser };
} 

/*
* Note:  As of now, spotify only allows 50 max results for both
* getRecentlyPlayedTracks and getUsersTopTracks.  In the future, we
* may want to allow for pagination, but for now it does not matter
*/

function getRecentlyPlayedTracks({ userID }) {
  return new Promise((resolve, reject) => {
    db.models.SpotifyUser.findOne({ where: { userID: userID } })
      .then(spotifyUser => api.getRecentlyPlayedTracks({ accessToken: spotifyUser.accessToken, refreshToken: spotifyUser.refreshToken }))
      .then(data => resolve(data.items.map(item => item.track)))
      .catch(err => reject(logAndReturnError(err)));
  });
}

function getUsersTopTracks({ userID }) {
  return new Promise((resolve, reject) => {
    db.models.SpotifyUser.findOne({ where: { userID } })
      .then(spotifyUser => api.getUsersTopTracks({ accessToken: spotifyUser.accessToken, refreshToken: spotifyUser.refreshToken }))
      .then(data => resolve(data.items))
      .catch(err => reject(logAndReturnError(err)));
  });
}

function getUsersSavedTracks({ userID, maxTrackCount=1000 }) {
  async function _getUsersSavedTracks({ accessToken, refreshToken, offset=0, previouslyReceivedTracks=[] }) {
    const data = await api.getUsersSavedTracks({ accessToken, refreshToken, offset });
    const receivedTracks = data.items.map(item => item.track);
    const newPreviouslyReceivedTracks = previouslyReceivedTracks.concat(receivedTracks);
    if (newPreviouslyReceivedTracks.length >= maxTrackCount || !data.next) {
      return newPreviouslyReceivedTracks;
    } else {
      return newPreviouslyReceivedTracks.concat(await _getUsersSavedTracks({ accessToken, refreshToken, offset: offset+50, previouslyReceivedTracks }));
    }
  }

  return new Promise((resolve, reject) => {
    db.models.SpotifyUser.findOne({ where: { userID } })
      .then(spotifyUser => _getUsersSavedTracks({ accessToken: spotifyUser.accessToken, refreshToken: spotifyUser.refreshToken }))
      .then(tracks => resolve(tracks))
      .catch(err => reject(logAndReturnError(err)));
  });
}

async function getUserRelatedSongSeeds({ userID, minimum=150 }) {
  let [topTracks, savedTracks] = await Promise.all([
    getUsersTopTracks({ userID }),
    getUsersSavedTracks({ userID })
  ]);
  var totalTracks = removeDuplicates(topTracks.concat(savedTracks));
  totalTracks = await padWithSimilarSongs({ tracks: totalTracks, minimum });
  return spotifyTracksToSongSeeds(totalTracks);
}

/*
* Helper functions
*/
function playolaProfileFromSpotifyProfile(spotifyProfile) {
  return {
    displayName: spotifyProfile.display_name,
    email: spotifyProfile.email,
    profileImageURL: spotifyProfile.images && spotifyProfile.images.length ? spotifyProfile.images[0].url : undefined
  };
}

async function padWithSimilarSongs({ tracks, minimum=150 }) {
  async function _padWithSimilarSongs({ tracks, minimum, artists=[] }) {
    if (tracks.length >= minimum) return tracks;
    const seed_artists = artists
      .slice(0,5).map(artist => artist.id);
    const data = await api.getRecommendedTracks({ seed_artists });
    const updatedTracks = removeDuplicates(tracks.concat(data.tracks));
    return await _padWithSimilarSongs({ tracks: updatedTracks, minimum, artists: artists.slice(2) });
  }

  // produce on array of artists in order of their frequency
  function createArtistArray(tracks) {
    const artistInfo = {};
    for (let track of tracks) {    
      if (!track['artists'] || !track['artists'].length) continue;
      let artist = track['artists'][0];
      if (!artistInfo[artist.id]) 
        artistInfo[artist.id] = { artist, count: 0 };
      artistInfo[artist.id].count += 1;
    }
    const sortedArtistInfos = Object.values(artistInfo).sort((a,b) => (a.count < b.count) ? 1 : -1);
    return sortedArtistInfos.map(info => info.artist);
  }

  const artists = createArtistArray(tracks);
  return await _padWithSimilarSongs({ tracks, minimum, artists });
}

function removeDuplicates(tracks) {
  var alreadySeen = {};
  var dupesRemoved = [];
  for (let track of tracks) {
    if (!alreadySeen[track.id]) {
      alreadySeen[track.id] = true;
      dupesRemoved.push(track);
    }
  }
  return dupesRemoved;
}

function spotifyTracksToSongSeeds(tracks) {
  return tracks.map(track => { 
    return {
      title:  track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      durationMS: track.duration_ms,
      isrc: track.external_ids ? track.external_ids.isrc : undefined,
      spotifyID: track.id
    }; 
  });
}

module.exports = {
  createSpotifyUserAndUser,

  getPlayolaUserSeed,
  updateTokens,
  getRecentlyPlayedTracks,
  getUsersTopTracks,
  getUsersSavedTracks,
  getUserRelatedSongSeeds
};