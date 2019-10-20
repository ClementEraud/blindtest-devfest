<template>
    <div>
        <v-row align="center" justify="center">
            <v-col cols="3">
                <v-subheader>Nouveau joueur</v-subheader>
            </v-col>
            <v-col cols="4">
                <v-text-field label="Nom ou pseudonyme" v-model="playerToAdd"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn @click="addPlayer" :disabled="this.playerToAdd.length < 1" text>Ajouter</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3" v-for="(player, index) in players" :key="player.id">
                <v-card>
                    <v-card-text>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-avatar :color="colors[index]" left size="62">
                                    <span class="white--text headline"> {{ player.name[0].toUpperCase() }} </span>
                                </v-avatar>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <span class="title font-weight-light">
                                    {{ player.name }}
                                </span>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row>
            <v-col cols="2">
            <v-card v-if="levels.length > 0">
                <v-tabs vertical v-model="tab">
                <v-tab v-for="level in levels" :key="level.id" :disabled="level.playlists.length < 1">{{ level.label }}</v-tab>
                </v-tabs>
            </v-card>
            </v-col>

            <v-col cols="10">
                <v-row no-gutters v-if="playlists.length > 0">
                    <v-item-group mandatory v-model="item">
                        <v-item v-slot:default="{active, toggle }" v-for="playlist in playlists" :key="playlist.id">
                            <v-col>
                                <v-card dark @click="toggle" :color="active ? 'primary' : ''">
                                    <v-card-title> {{ playlist.name }} </v-card-title>
                                </v-card>
                            </v-col>
                        </v-item>
                    </v-item-group>
                </v-row>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
            <v-col cols="2">
                <v-btn @click="goBack" color="primary" large>
                    <div class="btn-text">Annuler</div>
                </v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="launch" color="primary" large :disabled="players.length < 1 || selectedPlaylist === null">
                    <div class="btn-text">Lancer</div>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
  import { ipcRenderer } from "electron";
  import { eventTypes } from "@/enums/events.js";

    export default {
        name: 'AdminGameSet',
        components: { },
        data: () => ({
            colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
            item: 0,
            levels: [ ],
            playerToAdd: "",
            tab: 0
        }),
        computed: {
            playlists() {
                if(this.levels.length > 0)
                    return this.levels[this.tab].playlists
                return [ ]
            },
            selectedPlaylist() {
                if(this.levels.length > 0)
                    return this.levels[this.tab].playlists[this.item]
                return null
            }
        },
        methods: {
            addPlayer() {
                if(this.playerToAdd.length > 0) {
                    this.$emit("add:player", this.playerToAdd)
                    this.playerToAdd = '';
                }
            },
            goBack() {
                this.$router.go(-1);
            },
            launch() {
                this.$emit('launch:game', this.selectedPlaylist.id)
            }
        },
        mounted() {
            ipcRenderer.on(eventTypes.getAllLevels, (event, levels) => {
                this.levels = levels
            });

            ipcRenderer.send(eventTypes.getAllLevels, {});
        },
        props: {
            gameId: String,
            players: Array
        },
        watch: {
            tab() {
                // Changement de difficulté
                this.item = 0
            }
        }
    }
</script>

<style scoped>
</style>