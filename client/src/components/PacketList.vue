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
      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          label="Suche"
          hide-details="auto"
          v-model="searchValue"
          append-inner-icon="mdi-magnify"
          density="comfortable"
        >
        </v-text-field>
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
          :search-field="searchField"
          :search-value="searchValue"
          sort-by="company"
          class="data-table"
          @click-row="showPacketDetails"
        >
        <template #item-number="{ number }">
          <div class="font-weight-bold">{{ number }}</div>
        </template>
        </EasyDataTable>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    activator="#btn-new-packet"
    v-model="newPacketDialogVisible"
    max-width="700px"
    min-width="450px"
    scrollable
  >
    <NewPacketCard v-model:parent-dialog-active="newPacketDialogVisible"/>
  </v-dialog>

  <v-dialog
    v-model="packetDialogVisible"
    max-width="1000px"
    min-width="450px"
    scrollable
  >
    <PacketCard v-model:parentDialogActive="packetDialogVisible" :packetID="selectedPacket"/>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ClickRowArgument, Header, Item } from 'vue3-easy-data-table';
import NewPacketCard from '@/components/NewPacketCard.vue';
import PacketCard from '@/components/PacketCard.vue';

const rowsPerPage = 10000; // "disable" pagination
const searchField = ["number", "company", "location"];
const searchValue = ref("");

const newPacketDialogVisible = ref(false);
const packetDialogVisible = ref(false);
const selectedPacket = ref(0);

const headers: Header[] = [
  { text: "Number", value: "number", sortable: true },
  { text: "Tag", value: "day", sortable: false },
  { text: "Unternehmen", value: "company", sortable: true },
  { text: "Position", value: "location", sortable: true },
];

const items: Item[] = [
  { "number": 10101, "day": "Dienstag", "company": "Julian AG", "location": "A1" },
  { "number": 10102, "day": "Dienstag", "company": "Julian AG", "location": "A1" },
  { "number": 52301, "day": "Dienstag", "company": "Laura AG", "location": "A2" },
  { "number": 54901, "day": "Mittwoch", "company": "Ju AG", "location": "A3" },
  { "number": 3340965, "day": "Mittwoch", "company": "Saro AG", "location": "A4" },
];

const showPacketDetails = (item: ClickRowArgument) => {
  selectedPacket.value = item.number;
  packetDialogVisible.value = true;
};

let scannerInput = "";
window.onkeypress = (event: KeyboardEvent) => {
  if(event.key == "Enter") {
    const matchedItems = items.filter(i => i.number === parseInt(scannerInput));

    if(matchedItems.length == 0) {
      console.log("Packet not found: " + scannerInput);
      scannerInput = "";
      return;
    }

    const item = matchedItems[0];
    selectedPacket.value = item.number;
    packetDialogVisible.value = true;
    scannerInput = "";

    event.preventDefault();
  } else if(!isNaN(parseInt(event.key))) {
    scannerInput = scannerInput + event.key;
  }
};

</script>

<style>
@import "../assets/tableStyle.css"
</style>
