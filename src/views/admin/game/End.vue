<template>
    <v-container class="fill-height" fluid v-if="game !== null">
        <v-row align="center" justify="center">
            <p>{{ bestPlayer.name }} gagne la partie !</p>
        </v-row>
    </v-container>
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";

    export default {
        name: 'AdminGameEnd',
        data: () => ({
            bestPlayer: null,
            game: null
        }),
        computed: {
        },
        mounted() {
            ipcRenderer.on(eventTypes.getGame, (event, game) => {
                this.game = game
                this.bestPlayer = this.game.players.sort(p => p.score).reverse()[0]
            });
            ipcRenderer.send(eventTypes.getGame, this.gameId);
        },
        methods: {
        },
        props: {
            gameId: String
        }
    }
</script>