const mysql = require('mysql');
const async = require('async');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'blindtest'
});

const insertPlayer = ({playerName, gameId}, done) => {
  async.waterfall([
    cb => createNewPlayer(playerName, cb),
    (res, cb) => addPlayersToGame([res.insertId], gameId, cb)
  ], done);
}

/**
 * For some reason, if we pass cb directly to connection.query, the cb is undefined...
 * 
 */

const createNewPlayer = (playerName, cb) => {
  connection.query(`INSERT INTO player (name) values (?);`, [playerName], (err, res) => {
    if(err) throw err;
    cb(null, res);
  });
}

const addPlayersToGame = (playersIds, gameId, cb) => {
  async.each(playersIds,
    (playerId, next) => connection.query(`INSERT INTO game_has_player (gameId, playerId) values (?, ?);`, [gameId, playerId], next),
    (err) => {
      if(err) return cb(err);
      getPlayersOfGame(gameId, cb);
    });
};

const getPlayersOfGame = (gameId, cb) => {
  connection.query(`
    SELECT p.id, p.name
    FROM player p LEFT JOIN game_has_player ghp ON ghp.playerId = p.id
    WHERE ghp.gameId = ?
  `, [gameId], (err, res) => {
    cb(err, res);
  });
};


const addNewSong = (songPath, songName, songArtist, cb) => {
  connection.query(`
    SELECT id
    FROM song
    WHERE song.path = ?
    AND song.name = ?
    AND song.artist = ?
  `, [songPath, songName, songArtist], (err, songAlreadyExists) => {
    if (err) return cb(err);

    if (songAlreadyExists && songAlreadyExists.length) return cb();

    connection.query(`INSERT INTO song (name, artist, path) VALUES (?, ?, ?)`, [songName, songArtist, songPath], cb);
  });
};

const createGame = (cb) => {
  connection.query(`INSERT INTO game () VALUES ();`, cb);
}

export {
  connection,
  createGame,
  insertPlayer,
  addNewSong
}