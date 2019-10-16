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

const addPlaylist = (playlistName, levelLabel, done) => {
  async.waterfall([
    cb => getPlaylist(playlistName, cb),
    (playlistExists, infos, cb) => {
      if (playlistExists && playlistExists.length) return cb();
      getLevel(levelLabel, (err, level) => {
        if (err) return cb(err);
        if (level && level.length) {
          connection.query(`INSERT INTO playlist (name, levelId) VALUES (?, ?)`, [playlistName, level[0].id], cb);
        }
      });
    }
  ], done);
};

const getLevel = (label, cb) => {
  connection.query(`
    SELECT *
    FROM level
    WHERE label = ?
  `, [label] , cb);
};

const addLevel = (label, cb) => {
  connection.query(`
    SELECT id
    FROM level
    WHERE label = ?
  `, [label], (err, levelExists) => {
    if (err) return cb(err);

    if (levelExists && levelExists.length) return cb();

    connection.query(`INSERT INTO level (label) VALUES (?)`, [label], cb);
  })
};

const assignSongToPlaylist = (songId, playlistId, cb) => {
  connection.query(
    `
      SELECT songId, playlistId
      FROM playlist_has_song
      WHERE playlistId = ?
      AND songId = ?
    `, [playlistId, songId], (err, songAssignedToPlaylist) => {
      if (err) return cb(err);

      if (songAssignedToPlaylist && songAssignedToPlaylist.length) return cb();

      connection.query(`INSERT INTO playlist_has_song (songId, playlistId) VALUES (?, ?)`, [songId, playlistId], cb);
    });
}

const getPlaylist = (name, cb) => {
  connection.query(
    `
      SELECT *
      FROM playlist
      WHERE name = ?
    `,
    [name], cb);
}

const createGame = (cb) => {
  connection.query(`INSERT INTO game () VALUES ();`, cb);
}

const createGameHasPlayer = (gameId, players, cb) => {
  async.each(
    players,
    (player, next) => connection.query(`INSERT INTO game_has_player (gameId, playerId) VALUES (?, ?)`, [gameId, player.id], next),
    cb
  )
};

const updateGamePlaylist = (gameId, playlistId, cb) => {
  connection.query('UPDATE game SET playlistId = ? WHERE id = ?', [playlistId, gameId], cb);
}

const getAllLevels = cb => {
  connection.query(`
    SELECT 
      level.id as levelId,
      level.label as levelLabel,
      playlist.id as playlistId,
      playlist.name as playlistName
    FROM level
    LEFT JOIN playlist ON playlist.levelId = level.id
  `, (err, res) => {
    if(err) return cb(err);
    const levelIds = new Set(res.map(resLine => resLine.levelId));
    const levels = [];

    levelIds.forEach(levelId => {
      levels.push({
        id: levelId,
        label: res.find(level => level.levelId === levelId).levelLabel,
        playlists: res
          .filter(level => level.levelId === levelId)
          .map(playlistOfLevel => ({
              id: playlistOfLevel.playlistId,
              name: playlistOfLevel.playlistName
          }))
          .filter(playlist => !!playlist.id)
      });
    });
    return cb(null, levels);
  });
}

const getGameInfos = (gameId, done) => {
  async.parallel({
    game: cb => getGame(gameId, cb),
    gamePlayers: cb => getGamePlayers(gameId, cb),
    gameSongs: cb => getGameSongs(gameId, cb)
  }, (err, {game, gamePlayers, gameSongs}) => {
    if (err) return done(err);
    const gameRes = game[0];
    gameRes.players = gamePlayers;
    gameRes.songs = gameSongs;
    done(null, gameRes);
  });
}

const basicCbFunction = cb => (err, res) => {
  if(err) return cb(err);
  cb(null, res);
}

const getGame = (gameId, cb) => {
  connection.query(`
    SELECT
      g.id,
      p.name as playlistName,
      l.label as level
    FROM game g
      LEFT JOIN playlist p ON p.id = g.playlistId
      LEFT JOIN level l ON l.id = p.levelId
    WHERE g.id = ?
  `, [gameId], basicCbFunction(cb));
}

const getGamePlayers = (gameId, cb) => {
  connection.query(`
    SELECT
      p.id,
      p.name,
      ghp.score
    FROM player p
     LEFT JOIN game_has_player ghp ON ghp.playerId = p.id
    WHERE ghp.gameId = ?
  `, [gameId], basicCbFunction(cb));
}

const getGameSongs = (gameId, cb) => {
  connection.query(`
    SELECT
      s.id,
      s.name,
      s.artist,
      s.path
    FROM song s
     LEFT JOIN playlist_has_song phs ON phs.songId = s.id
     LEFT JOIN game g ON g.playlistId = phs.playlistId
    WHERE g.id = ?
  `, [gameId], basicCbFunction(cb));
}

export {
  connection,
  createGame,
  insertPlayer,
  addNewSong,
  addPlaylist,
  assignSongToPlaylist,
  createGameHasPlayer,
  getPlaylist,
  getAllLevels,
  addLevel,
  updateGamePlaylist,
  getGameInfos
}