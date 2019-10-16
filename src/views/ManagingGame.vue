<template>
  <v-container>
    <v-divider></v-divider>
    <v-row>Music Player</v-row>
    <v-divider></v-divider>
    <v-row>Players and scores: {{ game }}</v-row>
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { eventTypes } from "@/enums/events.js";

export default {
  name: 'managingGame',
  props: ['gameId'],
  data() {
    return {
      game: {}
    }
  },
  mounted() {
    ipcRenderer.on(eventTypes.getGame, (event, game) => {
      console.log('lolay', game);
      this.game = game;
    });
    ipcRenderer.send(eventTypes.getGame, this.gameId);
  }
}
</script>