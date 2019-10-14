<template>
  <v-container id="startGame" height="100%">
    <v-row>
      <v-col cols="12">
        <page-header title="Bienvenue au blindest !"></page-header>
      </v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col cols="4"></v-col>
      <v-col cols="4">
        <v-layout justify-center>
          <v-btn v-on:click="gameCreation" color="primary" height="70px" width="250px">
            <div class="btn-text">Start a new game !</div>
          </v-btn>
        </v-layout>
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer } from "electron";
  import { eventTypes } from "@/enums/events.js";

  export default {
    name: 'startGame',
    methods: {
      gameCreation() {
        const msg = 'a new game has been launched';
        ipcRenderer.send(eventTypes.gameCreation, msg);

        ipcRenderer.on(eventTypes.gameCreation, (event, gameId) => {

          this.$router.push(`/create-game/${gameId}`);
        });
      }
    },
  }
</script>

<style>
  h1 {
    color: var(--v-secondary-base);
  }

  .btn-text {
    color: var(--v-secondary-base);
  }
</style>