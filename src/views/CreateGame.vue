<template>
<v-container>
  <v-row>
    <v-col cols="12">
      <page-header title='Démarrer une nouvelle partie'></page-header>
    </v-col>
  </v-row>
  <v-row>
    <v-layout justify-center>
      <v-col cols="2">
        <create-player :gameId ="gameId"/>
      </v-col>
    </v-layout>
  </v-row>
  <v-row>
    <v-layout v-if="players" justify-center>
      <v-col v-for="player in players" :key="player.id" cols="2">
        <v-card>
          <v-card-text>{{player.name}}</v-card-text>
        </v-card>
      </v-col>
    </v-layout>
  </v-row>
</v-container>
</template>

<script>
import CreatePlayer from '@/components/CreatePlayer.vue';
import { ipcRenderer } from "electron";
import { events, eventTypes } from "@/enums/events.js";

export default {
    name: 'createGame',
    components: {
      'create-player': CreatePlayer
    },
    props: ['gameId'],
    data: function() {
      return {
        players: []
      }
    },
    mounted() {
      ipcRenderer.on(events.get(eventTypes.createPlayer), (event, players) => {
        this.players = players;
      });
    }
}
</script>