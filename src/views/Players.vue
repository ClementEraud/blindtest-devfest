<template>
  <v-container>
    <v-row justify="center">
      <waiting-game-dialog :open="waitingDialog" text="En attente de début de partie"/>
      <waiting-game-dialog :open="waitingPlayersDialog" text="En attente de création de joueurs"/>
    </v-row>
    <v-row>
      <players-list :players="players"/>
    </v-row> 
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { eventTypes } from "@/enums/events.js";
import WaitingGameDialog from "@/components/dialogs/WaitingGameDialog.vue";
import PlayersList from "@/components/PlayersList.vue";

export default {
  name: 'players',
  components: {
    'waiting-game-dialog': WaitingGameDialog,
    'players-list': PlayersList,
  },
  data() {
    return {
      waitingDialog: true,
      waitingPlayersDialog: false,
      players: []
    }
  },
  mounted() {
    // Setup event listeneners
    ipcRenderer.on(eventTypes.gameCreation, () => {
      this.waitingDialog = false;
      this.waitingPlayersDialog  = true;
    });

    ipcRenderer.on(eventTypes.createPlayer, (e, players) => {
      this.waitingPlayersDialog = false;
      this.players = players;
    });

    ipcRenderer.on(eventTypes.launchGame, (e, data) => {
      console.log('launchGame', data);
    });
  }
}
</script>