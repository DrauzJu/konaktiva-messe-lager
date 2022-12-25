<template>
  <v-app id="appId">
    <v-app-bar
      class="px-3"
      color="white"
      flat
      density="compact"
    >
      <h1 class="text-h4">konaktiva Lager</h1>

      <v-spacer></v-spacer>

      <v-tabs
        centered
        color="primary"
      >
        <v-tab key="packets" to="/packetList">
          Pakete
        </v-tab>
        <v-divider vertical></v-divider>
        <v-tab key="companies" to="/companyList">
          Unternehmen
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main class="bg-grey-lighten-2">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style>
h1 {
  color: #e6007e;
}
</style>
