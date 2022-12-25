<template>
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
import { Header, Item } from 'vue3-easy-data-table';

const rowsPerPage = 10000; // "disable" pagination

const headers: Header[] = [
  { text: "ID", value: "ID", sortable: true },
  { text: "Tag", value: "day", sortable: false },
  { text: "Unternehmen", value: "company", sortable: true },
];

const items: Item[] = [
  { "ID": 101, "day": "Dienstag", "company": "Julian AG"},
  { "ID": 523, "day": "Dienstag", "company": "Laura AG"},
  { "ID": 549, "day": "Mittwoch", "company": "Ju AG"},
];
</script>

<style>
@import "../assets/tableStyle.css"
</style>
