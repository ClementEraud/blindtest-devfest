// The purpose here is to have enums and maps instead of plain strings in all vue/js files

export const eventTypes = {
  gameCreation: 'gameCreationEvent',
  createPlayer: 'createPlayerEvent',
  launchGame: 'launchGameEvent',
  getAllLevels: 'getAllLevelsEvent'
}

// Map events-key events-value, to be used by electron main process
export const events = new Map([
  [eventTypes.gameCreation, 'creation_game_event'],
  [eventTypes.createPlayer, 'create_player_event'],
  [eventTypes.launchGame, 'launch_game_event'],
  [eventTypes.getAllLevels, 'get_levels_event'],
]);
