<template>
    <div class="fill-height">
        <v-app-bar color="primary" dark app>
            <v-toolbar-title>CapGemini - BlindTest</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon @click="openGameWindow" v-on="on">
                        <v-icon>mdi-window-restore</v-icon>
                    </v-btn>
                </template>
                <span>Ouvrir Jeu</span>
            </v-tooltip>
        </v-app-bar>

        <v-content class="fill-height">
            <router-view />
        </v-content>
    </div>
</template>

<script>
    import { ipcRenderer } from "electron";
    import { eventTypes } from "@/enums/events.js";

    export default {
        name: 'Admin',
        components: { },
        data: () => ({ }),
        methods: {
            openGameWindow() {
                ipcRenderer.send(eventTypes.gameWindowOpen, {})
            }
        },
        mounted() { }
    }
</script>

<style scoped>
</style>