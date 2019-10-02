<template>
  <v-layout v-if="players && players.length" justify-center>
    <div v-for="(player, index) in players" :key="player.id">
      <v-col v-if="index%4">
        <v-card>
          <v-card-title>{{player.name}}</v-card-title>
        </v-card>
      </v-col>

      <v-row v-else>
        <v-col>
          <v-card>
            <v-card-title>{{player.name}}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script>
export default {
  name: 'playersList',
  props: ['players']
}
</script>