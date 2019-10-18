<template>
  <v-card>
    <v-card-title>
      <v-col cols="4">{{ playlistName }} : {{currentSongIndex+1}} / {{songs.length}}</v-col>
      <v-col>
        <v-progress-linear :value="progressValue"></v-progress-linear>
      </v-col>
    </v-card-title>
    <v-card-text>
      {{songs ? songs[currentSongIndex].artist : ''}} - {{songs ? songs[currentSongIndex].name : ''}}
    </v-card-text>
    <v-card-actions>
      <v-btn text icon v-on:click="previous()">
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn text icon v-on:click="pause()">
        <v-icon>mdi-pause</v-icon>
      </v-btn>
      <v-btn text icon v-on:click="play()">
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn text icon v-on:click="next()">
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Howl } from "howler";
export default {
  name: 'musicPlayer',
  props: ['songs', 'playlistName'],
  data() {
    return {
      currentSongIndex: undefined,
      audio: undefined,
      progressValue: 0,
      intervalID: undefined,
    }
  },
  watch: {
    songs() {
      this.currentSongIndex = 0;
    },
    currentSongIndex(newVal) {
      clearInterval(this.intervalID);
      this.progressValue = 0;
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Howl({
        src: [this.songs[newVal].path],
      });
    },
    progressValue(newVal) {
      if (newVal >= 100) {
        this.audio.pause();
      }
    }
  },
  methods: {
    play() {
      this.audio.play();
      // progress bar, +7 every seconds so it will take about 15sec too go to 100.
      this.intervalID = setInterval(() => {
        this.progressValue = this.progressValue + 7;
      }, 1000);
    },
    pause() {
      this.audio.pause();
      clearInterval(this.intervalID);
    },
    next() {
      this.currentSongIndex = this.currentSongIndex === this.songs.length ? this.songs.length : this.currentSongIndex + 1;
    },
    previous() {
      this.currentSongIndex = this.currentSongIndex === 0 ? 0 : this.currentSongIndex - 1;
    }
  },
}
</script>