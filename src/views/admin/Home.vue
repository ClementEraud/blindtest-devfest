<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="5" class="text-center">
        <v-btn color="primary" x-large @click="createGame" >
          Lancer une nouvelle partie
        </v-btn>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer } from "electron";
  import { eventTypes } from "@/enums/events.js";

  export default {
    name: 'Home',
    methods: {
      createGame() {
        const msg = 'a new game has been launched';
        ipcRenderer.send(eventTypes.gameCreation, msg);

        ipcRenderer.on(eventTypes.gameCreation, (event, gameId) => {
            this.$router.push(`/admin/game/${gameId}`);
        });
      }
    },
  }
</script>

<style scoped>
  .v-btn__content {
    color: var(--v-secondary-base);
  }
</style>