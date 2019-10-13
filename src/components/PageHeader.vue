<template>
  <v-app-bar :elevation="10" color='primary'>
    <h1 class="display-2 font-weight-bold">
        {{ title }}
    </h1>
  </v-app-bar>
</template>

<script>
  export default {
      name: 'pageHeader',
      props: ['title']
  }
</script>