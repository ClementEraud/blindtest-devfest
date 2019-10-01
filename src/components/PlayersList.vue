<template>
  <v-layout v-if="players && players.length" justify-center>
    <v-col v-for="player in players" :key="player.id" cols="2">
      <v-card>
        <v-card-text>{{player.name}}</v-card-text>
      </v-card>
    </v-col>
  </v-layout>
</template>

<script>
export default {
  name: 'playersList',
  props: ['players']
}
</script>