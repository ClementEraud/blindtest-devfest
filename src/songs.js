import * as fs from 'fs';
import { parseFile } from 'music-metadata';
import { 
  addNewSong,
  addPlaylist,
  assignSongToPlaylist,
  getPlaylist,
  addLevel } from "./database.js";
import { each } from "async";

const extractSongs = cb => {
  const songsFiles = fs.readdirSync('public/assets/songs');

  each(
    songsFiles,
    (songFile, next) => {
      const songPath = `public/assets/songs/${songFile}`;
    
      parseFile(songPath)
        .then(metadata => {
          const {artist, title} = metadata.common;
  
          addNewSong(`./assets/songs/${songFile}`, title, artist, next);
        })
        .catch(err => cb(err));
    },
    cb
  );
};

const createLevels = cb => {
  const levelsToCreate = [
    'Facile',
    'Moyen',
    'Difficile'
  ];

  each(
    levelsToCreate,
    (level, next) => addLevel(level, next),
    cb
  );
}

const createPlaylists = cb => {
  const playlistsToCreate = [
    {name: 'Difficile1', level: 'Difficile'},
    {name: 'Moyen1', level: 'Moyen'},
    {name: 'Facile1', level: 'Facile'},
    {name: 'Facile2', level: 'Facile'},
  ];

  each(
    playlistsToCreate,
    ({name, level}, next) => addPlaylist(name, level, next),
    cb
  );
}

const assignSongsToPlaylist = cb => {
  const playlistsHasSongs = [
    {songId: 25, playlistName: 'Facile1'},  
    {songId: 35, playlistName: 'Facile1'},
    {songId: 38, playlistName: 'Facile1'},
    {songId: 60, playlistName: 'Facile1'},
    {songId: 61, playlistName: 'Facile1'},
    {songId: 68, playlistName: 'Facile1'},
    {songId: 73, playlistName: 'Facile1'},
    {songId: 81, playlistName: 'Facile1'},
    {songId: 71, playlistName: 'Facile1'},
    {songId: 112, playlistName: 'Facile1'},
    {songId: 114, playlistName: 'Facile1'},
    {songId: 15, playlistName: 'Facile2'},  
    {songId: 23, playlistName: 'Facile2'},
    {songId: 26, playlistName: 'Facile2'},
    {songId: 28, playlistName: 'Facile2'},
    {songId: 34, playlistName: 'Facile2'},
    {songId: 39, playlistName: 'Facile2'},
    {songId: 42, playlistName: 'Facile2'},
    {songId: 72, playlistName: 'Facile2'},
    {songId: 86, playlistName: 'Facile2'},
    {songId: 88, playlistName: 'Facile2'},
    {songId: 13, playlistName: 'Moyen1'},  
    {songId: 17, playlistName: 'Moyen1'},
    {songId: 31, playlistName: 'Moyen1'},
    {songId: 55, playlistName: 'Moyen1'},
    {songId: 57, playlistName: 'Moyen1'},
    {songId: 80, playlistName: 'Moyen1'},
    {songId: 93, playlistName: 'Moyen1'},
    {songId: 94, playlistName: 'Moyen1'},
    {songId: 105, playlistName: 'Moyen1'},
    {songId: 115, playlistName: 'Difficile1'},
    {songId: 110, playlistName: 'Difficile1'},
    {songId: 102, playlistName: 'Difficile1'},
    {songId: 97, playlistName: 'Difficile1'},
    {songId: 96, playlistName: 'Difficile1'},
    {songId: 95, playlistName: 'Difficile1'},
    {songId: 70, playlistName: 'Difficile1'},
    {songId: 69, playlistName: 'Difficile1'},
    {songId: 40, playlistName: 'Difficile1'},
    {songId: 37, playlistName: 'Difficile1'},
    {songId: 33, playlistName: 'Difficile1'},
    {songId: 8, playlistName: 'Difficile1'},
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
  assignSongsToPlaylist,
  createLevels,
};