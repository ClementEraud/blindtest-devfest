<template>
    <v-container class="fill-height" v-if="game !== null">
        <v-row align="center" justify="center">
            <v-col cols="6">
                <v-card>
                    <v-row align="center" justify="center">
                        <img :src="congratsGif" />
                    </v-row>
                    <v-row align="center" justify="center">
                        Et le gagnant est...
                    </v-row>
                    <v-row align="center" justify="center">
                        <p class="regular">{{ bestPlayer.name }}</p>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";

    export default {
      name: 'GameEnd',
      data: () => ({
        bestPlayer: null,
        game: null,
        gifs: [
            "https://media.giphy.com/media/g9582DNuQppxC/source.gif",
            "https://media.giphy.com/media/3o6fJ1BM7R2EBRDnxK/source.gif"
        ]
      }),
      computed: {
        congratsGif() {
            return this.gifs[Math.floor(Math.random() * this.gifs.length)]
        },
        songs() {
          return this.game.songs
        }
      },
      mounted() {
        ipcRenderer.on(eventTypes.getGame, (event, game) => {
            this.game = game
            this.bestPlayer = this.game.players.sort(p => p.score).reverse()[0]
        });
        // ipcRenderer.send(eventTypes.getGame, this.gameId);
      },
      methods: {

      },
      props: {
        gameId: String
      },
    }
</script>