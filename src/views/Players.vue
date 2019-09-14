<template>
  <v-card
    max-width="344"
    class="mx-auto"
  >
    <v-card-title>I'm a title</v-card-title>
    <v-card-text>I'm card text</v-card-text>
    <v-card-actions>
      <v-btn text>Click</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from "electron";
import { events, eventTypes } from "@/enums/events.js";
export default {
  name: 'players',
  mounted: () => {
    ipcRenderer.on(events.get(eventTypes.launchGame), (event, message) => {
      console.log(event, message);
    });
  }
}
</script>