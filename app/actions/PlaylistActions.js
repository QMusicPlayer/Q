import {actions} from '../constants'

export const searchTracks = (searchText) => {
	SC.initialize({
      client_id: 'f270bdc572dc8380259d38d8015bdbe7'
  });

  return SC.get('/tracks', {
    q: query,
  }).then(function(tracks) {
    return tracks;
  });
}