<template>
  <v-container>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col>
        <music-player :playlistName="game.playlistName" :songs="game.songs"/>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-layout justify-center>
        <v-col v-for="player in game.players" :key="player.id">
          <v-card>
            <v-card-title>{{ player.name }}</v-card-title>
            <v-card-text>{{ player.score }}</v-card-text>
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
            game: { }
        }),
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
            reduceScore(player) {
                player.score = player.score - 1;
                ipcRenderer.send(eventTypes.scoreUpdate, {player: player, gameId: this.gameId});
            }
        },
        props: {
            gameId: String,
            players: Array
        },
    }
</script>