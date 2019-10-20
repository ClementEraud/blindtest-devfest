<template>
  <v-container>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col>
        <music-player :playlistName="game.playlistName" :songs="songs" v-if="game !== null" />
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-layout justify-center v-if="game !== null">
        <v-col v-for="(player, index) in players" :key="player.id" cols="3">
          <v-card>
            <v-card-title>
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar :color="colors[index]" left>
                    <span class="white--text headline"> {{ player.name[0].toUpperCase() }} </span>
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <span class="title font-weight-light">
                    {{ player.name }}
                  </span>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>
            <v-card-text v-if="player.score">Score : {{ player.score }}</v-card-text>
            <v-card-actions>
              <v-btn text icon color="black" v-on:click="reduceScore(player)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-btn text icon color="black" v-on:click="addScore(player)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-layout>
    </v-row>
    <v-divider />

    <v-row align="center" justify="end">
      <v-col cols="3" color="primary" @click="endGame">
        <v-btn>Terminer la partie</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";
    import MusicPlayer from "@/components/MusicPlayer.vue";

    export default {
      name: 'AdminGamePlay',
      components: {
        'music-player': MusicPlayer
      },
      data: () => ({
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
        game: null
      }),
      computed: {
        players() {
          return this.game.players
        },
        songs() {
          return this.game.songs
        }
      },
      mounted() {
        ipcRenderer.on(eventTypes.getGame, (event, game) => {
          this.game = game
        });
        ipcRenderer.send(eventTypes.getGame, this.gameId);
      },
      methods: {
        addScore(player) {
          player.score = player.score + 1;
          ipcRenderer.send(eventTypes.scoreUpdate, {player: player, gameId: this.gameId});
        },
        endGame() {
          this.$emit('end:game')
        },
        reduceScore(player) {
          player.score = player.score - 1;
          ipcRenderer.send(eventTypes.scoreUpdate, {player: player, gameId: this.gameId});
        }
      },
      props: {
        gameId: String
      },
    }
</script>