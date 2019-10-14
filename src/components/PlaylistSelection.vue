<template>
  <v-row>
    <v-col cols="2">
      <v-card>
        <v-tabs v-on:change="selectLevel" vertical>
          <v-tab v-for="level in levels" :key="level.id">{{ level.label }}</v-tab>
        </v-tabs>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card 
        v-for="playlist in selectedLevel.playlists" :key="playlist.id"
        v-on:click="selectPlaylist(playlist)"
        v-bind:class="{ primary: selectedPlaylist.id === playlist.id }">
        <v-card-title>
          {{ playlist.name }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import { ipcRenderer } from "electron";
  import { eventTypes } from "@/enums/events.js";

  export default {
    name: 'playlistSelection',
    data() {
      return {
        levels: [],
        selectedLevel: {},
        selectedPlaylist: {}
      }
    },
    methods: {
      selectLevel(tabIndex) {
        this.selectedLevel = this.levels[tabIndex];
      },
      selectPlaylist(playlist) {
        this.selectedPlaylist = playlist;
        this.$emit('select-playlist', playlist);
      }
    },
    mounted() {
      ipcRenderer.on(eventTypes.getAllLevels, (event, levels) => {
        this.levels = levels;
      });
    } 
  }
</script>