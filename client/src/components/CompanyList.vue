<template>
  <v-overlay :model-value="loading" class="align-center justify-center"></v-overlay>
  <v-container class="fill-height">
    <v-row
      no-gutters
      class="align-center"
    >
      <v-col class="mr-2">
        <v-btn
          color="primary"
          id="btn-new-packet"
          size="large"
        >
          Neu
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <EasyDataTable
          :headers="headers"
          :items="items"
          hideFooter
          alternating
          :rowsPerPage="rowsPerPage"
          sort-by="company"
          class="data-table"
        >
        </EasyDataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { Header, Item } from 'vue3-easy-data-table';

const rowsPerPage = 10000; // "disable" pagination
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Tag", value: "day", sortable: false },
  { text: "Unternehmen", value: "name", sortable: true },
];

const loading = ref(false);
const items = reactive<Item[]>([]);

onMounted(async () => {
  loading.value = true;
  items.length = 0;

  try {
    items.length = 0;
    items.push(await axios.get('/api/company'));
  } catch(e) {
    alert(e);
  } finally {
    loading.value = false;
  }
})
</script>

<style>
@import "../assets/tableStyle.css"
</style>
