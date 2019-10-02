import * as fs from 'fs';
import { parseFile } from 'music-metadata';
import { addNewSong } from "./database.js";
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


export {
  extractSongs
};