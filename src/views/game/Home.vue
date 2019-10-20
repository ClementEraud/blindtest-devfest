<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="4">
                <v-card v-if="players.length > 0" style="width: 100%">
                    <v-list>
                        <v-subheader>{{ players.length }} {{ players.length > 1 ? "Joueurs" : "Joueur" }}</v-subheader>
                        <v-list-item v-for="(player, index) in players" :key="player.id">
                            <v-list-item-icon />

                            <v-list-item-content>
                                <v-list-item-title class="title font-weight-light">{{ player.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar>
                                <v-avatar :color="colors[index]" size="36">
                                    <span class="white--text headline"> {{ player.name[0] }} </span>
                                </v-avatar>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'GameHome',
        components: { },
        data: () => ({
            colors: ["blue", "red", "green", "orange"]
        }),
        computed: {

        },
        methods: {

        },
        mounted() {
            
        },
        props: {
            players: Array
        }
    }
</script>

<style scoped>
</style>