<template>
  <v-container>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col>
        <music-player :playlistName="game.playlistName"  :songs="game.songs"/>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>Players and scores: {{ game }}</v-row>
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { eventTypes } from "@/enums/events.js";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
  name: 'managingGame',
  props: ['gameId'],
  components: {
    'music-player': MusicPlayer
  },
  data() {
    return {
      game: {}
    }
  },
  mounted() {
    ipcRenderer.on(eventTypes.getGame, (event, game) => {
      this.game = game;
    });
    ipcRenderer.send(eventTypes.getGame, this.gameId);
  }
}
</script>