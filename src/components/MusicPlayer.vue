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
import { Howl } from "howler";
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
  methods: {
    play() {
      this.currentSong = this.songs[0];
      console.log(JSON.parse(JSON.stringify(this.currentSong)));
      const music = new Howl({
        src: [this.currentSong.path],
      });
      music.play();
    },
  },
}
</script>