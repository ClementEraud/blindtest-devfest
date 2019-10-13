import * as fs from 'fs';
import { parseFile } from 'music-metadata';
import { addNewSong, addPlaylist, assignSongToPlaylist, getPlaylist } from "./database.js";
import { each } from "async";

const extractSongs = cb => {
  const songsFiles = fs.readdirSync('src/assets/songs');

  each(
    songsFiles,
    (songFile, next) => {
      const songPath = `src/assets/songs/${songFile}`;
    
      parseFile(songPath)
        .then(metadata => {
          const {artist, title} = metadata.common;
  
          addNewSong(songPath, title, artist, next);
        })
        .catch(err => cb(err));
    },
    cb
  );
};

const createPlaylists = cb => {
  const playlistsToCreate = [
    {name: 'Rock Classic', levelId: 3},
  ];

  each(
    playlistsToCreate,
    ({name, levelId}, next) => addPlaylist(name, levelId, next),
    cb
  );
}

const assignSongsToPlaylist = cb => {
  const playlistsHasSongs = [
    {songId: 1, playlistName: 'Rock Classic'},
    {songId: 2, playlistName: 'Rock Classic'},
    {songId: 3, playlistName: 'Rock Classic'},
    {songId: 4, playlistName: 'Rock Classic'},
    {songId: 5, playlistName: 'Rock Classic'},
    {songId: 6, playlistName: 'Rock Classic'},
    {songId: 7, playlistName: 'Rock Classic'},
    {songId: 8, playlistName: 'Rock Classic'},
    {songId: 9, playlistName: 'Rock Classic'},
  ];

  each(
    playlistsHasSongs,
    ({songId, playlistName}, next) => {
      getPlaylist(playlistName, (err, playlist) => {
        if (err) return cb(err);
        assignSongToPlaylist(songId, playlist[0].id, next);
      });
    },
    cb
  );
}


export {
  extractSongs,
  createPlaylists,
  assignSongsToPlaylist
};