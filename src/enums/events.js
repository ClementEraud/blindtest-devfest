// The purpose here is to have enums and maps instead of plain strings in all vue/js files

export const eventTypes = {
  launchGame: 'launchGameEvent',
  createPlayer: 'createPlayerEvent'
}

// Map events-key events-value, to be used by electron main process
export const events = new Map([
  [eventTypes.launchGame, 'launch_game_event'],
  [eventTypes.createPlayer, 'create_player_event']
]);
