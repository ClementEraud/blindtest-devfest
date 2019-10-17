<template>
  <v-card>
    <v-card-title>{{ playlistName }}</v-card-title>
    {{currentSong.artist}} - {{currentSong.name}}
    <v-card-text>
      <v-progress-linear :value="progressValue"></v-progress-linear>
    </v-card-text>
    <v-card-actions>
      <v-btn text icon>
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn text icon>
        <v-icon>mdi-pause</v-icon>
      </v-btn>
      <v-btn text icon v-on:click="play()">
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn text icon>
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { eventTypes } from '@/enums/events.js';
export default {
  name: 'musicPlayer',
  props: ['songs', 'playlistName'],
  data() {
    return {
      currentSong: {},
    }
  },
  computed: {
    progressValue() {
      return 50;
    }
  },
  watch: {
    sounds(val) {
      this.currentSong = this.songs[0];
    },
  },
  methods: {
    play() {
      this.getSound((event, song) => {
        console.log(song);
        const music = new Audio(song);
        music.load();
          
        music.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
          
        music.play();
      });
    },
    getSound(cb) {
      ipcRenderer.on(eventTypes.getSound, cb);
      ipcRenderer.send(eventTypes.getSound, this.currentSong.path);
    }
  }
}
</script>