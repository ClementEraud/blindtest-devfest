<template>
    <v-content class="fill-height">
        <v-row justify="center">
            <waiting-game-dialog :open="waitingDialog" text="En attente de début de partie"/>
            <waiting-game-dialog :open="waitingPlayersDialog" text="En attente de création de joueurs"/>
        </v-row>

        <router-view :gameId="gameId" :players="players" />
    </v-content>

  <!-- <v-container>
    <v-row justify="center">
      <waiting-game-dialog :open="waitingDialog" text="En attente de début de partie"/>
      <waiting-game-dialog :open="waitingPlayersDialog" text="En attente de création de joueurs"/>
    </v-row>
    <v-row>
      <players-list :players="players"/>
    </v-row> 
  </v-container> -->
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";
    import WaitingGameDialog from "@/components/dialogs/WaitingGameDialog.vue";

    export default {
        name: 'Game',
        components: {
            'waiting-game-dialog': WaitingGameDialog
        },
        data: () => ({
            gameId: null,
            players: [ ],
            waitingDialog: true,
            waitingPlayersDialog: false,
            
        }),
        mounted() {
            // Setup event listeneners
            ipcRenderer.on(eventTypes.gameCancellation, () => {
                this.$router.push('/game')

                this.waitingDialog = true
                this.waitingPlayersDialog = false
            });

            ipcRenderer.on(eventTypes.gameCreation, (event, gameId) => {
                this.waitingDialog = false;
                this.waitingPlayersDialog  = true;

                this.$router.push(`/game/${gameId}`)
            });

            ipcRenderer.on(eventTypes.createPlayer, (e, players) => {
                this.waitingPlayersDialog = false;
                this.players = players;
            });

            ipcRenderer.on(eventTypes.launchGame, (e, data) => {
                this.$router.push(`/game/${data.gameId}/play`);
            });
    }
}
</script>