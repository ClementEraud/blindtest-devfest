<template>
  <v-dialog v-model="open" persistent>
      <v-card>
        <v-card-title class="justify-center">{{text}}</v-card-title>
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="primary"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'waitingGameDialog',
  props: ['open', 'text']
}
</script>