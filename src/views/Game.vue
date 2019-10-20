<template>
    <v-content class="fill-height">
        <v-row justify="center">
            <waiting-game-dialog :open="waitingDialog" text="En attente de début de partie"/>
            <waiting-game-dialog :open="waitingPlayersDialog" text="En attente de création de joueurs"/>
        </v-row>

        <router-view :gameId="gameId" :players="players" />
    </v-content>

    <!-- TODO ECRAN DE SCORE A LA PLACE DE WAITING DIALOG -->
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

                this.players = [ ]
            });

            ipcRenderer.on(eventTypes.GAME_CREATED, (event, gameId) => {
                this.waitingDialog = false;
                this.waitingPlayersDialog  = true;

                this.$router.push(`/game/${gameId}`)
            });

            ipcRenderer.on(eventTypes.gameEnd, (event, gameId) => {
                this.$router.push(`/game/${gameId}/end`)
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