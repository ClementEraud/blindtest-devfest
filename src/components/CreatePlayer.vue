<template>
  <v-card max-width="250px">
    <v-card-title>
      <v-text-field v-model="playerName">
        {{playerName}}
      </v-text-field>
    </v-card-title>
    <v-card-actions>
      <v-btn v-on:click="onCreate" text>Créer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from "electron";
import { events, eventTypes } from "@/enums/events.js";

export default {
  name: 'createPlayer',
  data: function () {
    return {
      playerName: ''
    }
  },
  props: ['gameId'],
  methods: {
    onCreate() {
      ipcRenderer.send(events.get(eventTypes.createPlayer), {
        playerName: this.playerName,
        gameId: this.gameId
      });
      this.playerName = '';
    }
  }
}
</script>