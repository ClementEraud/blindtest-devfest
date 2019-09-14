<template>
  <div id="startGame">
    <h1 class="display-2 font-weight-bold mb-3">
      Welcome to the blindtest !
    </h1>

    <v-btn v-on:click="launchGame">Start a new game !</v-btn>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { events, eventTypes } from "@/enums/events.js";

export default {
  name: 'startGame',
  methods: {
    launchGame: () => {
      const msg = 'a new game has been launched';
      console.log(msg);
      ipcRenderer.send(events.get(eventTypes.launchGame), msg);
    }
  }
}
</script>