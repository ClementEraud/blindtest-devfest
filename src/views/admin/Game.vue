<template>
    <v-container fluid>
        <v-toolbar elevation="1">
            <v-toolbar-title>Partie n°{{ gameId }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="$vuetify.breakpoint.smAndUp">
                <v-btn icon @click="cancelGame">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-toolbar>

        <router-view :gameId="gameId" :players="players" @add:player="addPlayer" @end:game="endGame" @launch:game="launchGame" />
    </v-container>
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";

    export default {
        name: 'AdminGame',
        data: () => ({
            players: [ ],
        }),
        methods: {
            addPlayer(playerName) {
                ipcRenderer.send(eventTypes.createPlayer, {
                    playerName: playerName,
                    gameId: this.gameId
                });
            },
            cancelGame() {
                ipcRenderer.send(eventTypes.gameCancellation, {});
                this.$router.push('/admin')
            },
            endGame() {
                ipcRenderer.send(eventTypes.gameEnd, { gameId: this.gameId });
                this.$router.push(`/admin/game/${this.gameId}/end`)
            },
            goBack() {
                this.$router.go(-1);
            },
            launchGame(playlistId) {
                ipcRenderer.send(eventTypes.launchGame, { gameId:this.gameId, players: this.players, playlistId: playlistId });
                this.$router.push(`/admin/game/${this.gameId}/play`);
            },
            selectPlaylist(playlist) {
                this.playlist = playlist;
            }
        },
        mounted() {
            ipcRenderer.on(eventTypes.createPlayer, (event, players) => {
                this.players = players;
            });
            ipcRenderer.send(eventTypes.getAllLevels, {});
        },
        props: {
            gameId: String
        }
    }
</script>

<style scoped>
    .v-toolbar__title {
        color: black;
    }
</style>