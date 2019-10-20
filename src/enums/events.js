// The purpose here is to have enums and maps instead of plain strings in all vue/js files

export const eventTypes = {
  createPlayer: 'createPlayerEvent',
  gameCancellation: 'gameCancellationEvent',

  GAME_CREATED: 'gameCreationEvent', // Une partie est créée
  
  gameEnd: 'gameEndEvent',
  gameWindowOpen: 'gameWindowOpenEvent',
  launchGame: 'launchGameEvent',
  getAllLevels: 'getAllLevelsEvent',
  getGame: 'getGameEvent',
  getSong: 'getSongEvent',
  scoreUpdate: 'scoreUpdateEvent'
}
