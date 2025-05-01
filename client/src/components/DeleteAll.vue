<template>
  <div>
    <h1>Delete all</h1>
    <v-btn @click="deleteAll()">Alles löschen</v-btn>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

async function deleteAll() {
  await deleteAllPacketMovements();
  await deleteAllPackages();
  await deleteAllCompanies();
}

async function deleteAllCompanies() {
  await axios
    .delete("/api/company")
    .then((response) => {
      console.log("All companies deleted:", response.data);
    })
    .catch((error) => {
      console.error("Error deleting companies:", error);
    });
}

async function deleteAllPacketMovements() {
  await axios
    .delete("/api/packetMovement")
    .then((response) => {
      console.log("All companies deleted:", response.data);
    })
    .catch((error) => {
      console.error("Error deleting companies:", error);
    });
}

async function deleteAllPackages() {
  await axios
    .delete("/api/packet")
    .then((response) => {
      console.log("All packets deleted:", response.data);
    })
    .catch((error) => {
      console.error("Error deleting packets:", error);
    });
}
</script>
