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
    <players-list :players="players"/>
  </v-row>
  <v-row>
    <v-col cols="2">
      <v-layout justify-center>
        <v-btn v-on:click="goBack" color="primary" height="70px" width="250px">
          <div class="btn-text">Go Back</div>
        </v-btn>
      </v-layout>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import CreatePlayer from '@/components/CreatePlayer.vue';
import { ipcRenderer } from "electron";
import { events, eventTypes } from "@/enums/events.js";
import PlayersList from "@/components/PlayersList.vue";

export default {
    name: 'createGame',
    components: {
      'create-player': CreatePlayer,
      'players-list': PlayersList,
    },
    props: ['gameId'],
    data() {
      return {
        players: []
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    },
    mounted() {
      ipcRenderer.on(events.get(eventTypes.createPlayer), (event, players) => {
        this.players = players;
      });
    }
}
</script>