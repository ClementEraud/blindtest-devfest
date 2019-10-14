<template>
<v-container>
  <v-row>
    <v-col cols="12">
      <page-header title='Démarrer une nouvelle partie'></page-header>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <v-col cols="2">
        Création de joueur.
    </v-col>
    <v-layout justify-center>
      <v-col cols="10">
        <create-player :gameId ="gameId"/>
      </v-col>
    </v-layout>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <players-list :players="players"/>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <playlist-selection v-on:select-playlist="selectPlaylist"/>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <v-col cols="4">
      <v-layout justify-center>
        <v-btn v-on:click="goBack" color="primary" height="70px" width="700px">
          <div class="btn-text">Retour en arrière</div>
        </v-btn>
      </v-layout>
    </v-col>
    <v-col cols="4">
      <v-layout justify-center>
        <v-btn v-on:click="launchGame" color="primary" height="70px" width="700px">
          <div class="btn-text">Démarrer la partie</div>
        </v-btn>
      </v-layout>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
  import CreatePlayer from '@/components/CreatePlayer.vue';
  import { ipcRenderer } from "electron";
  import { eventTypes } from "@/enums/events.js";
  import PlayersList from "@/components/PlayersList.vue";
  import PlaylistSelection from "@/components/PlaylistSelection.vue";

  export default {
      name: 'createGame',
      components: {
        'create-player': CreatePlayer,
        'players-list': PlayersList,
        'playlist-selection': PlaylistSelection
      },
      props: ['gameId'],
      data() {
        return {
          players: [],
          playlist: {}
        }
      },
      methods: {
        goBack() {
          this.$router.go(-1);
        },
        launchGame() {
          console.log(this.playlist);
          ipcRenderer.send(eventTypes.launchGame, {gameId:this.gameId, players: this.players, playlistId: this.playlist.id});
          return;
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
      }
  }
</script>