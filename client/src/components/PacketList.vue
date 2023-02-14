<template>
  <v-container class="fill-height">
    <v-row no-gutters class="align-center">
      <v-col class="mr-2">
        <v-btn id="btn-new-packet" color="primary" size="large"> Neu </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col id="showDestroyedPacketSwitch" class="self-align-center" cols="3">
        <v-switch
          v-model="showDestroyedPackets"
          hide-details
          label="Zerstörte Pakete anzeigen"
          color="primary"
        ></v-switch>
      </v-col>
      <v-col>
        <v-text-field
          v-model="searchValue"
          label="Suche (Stand, Lagerplatz, Unternehmen, ...)"
          hide-details="auto"
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
          hide-footer
          alternating
          :rows-per-page="rowsPerPage"
          :search-field="searchField"
          :search-value="searchValue"
          sort-by="company"
          class="data-table"
          @click-row="showPacketDetails"
        >
          <template #item-id="{ id }">
            <div class="font-weight-bold">{{ id }}</div>
          </template>
        </EasyDataTable>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="newPacketDialogVisible"
    activator="#btn-new-packet"
    max-width="700px"
    min-width="450px"
    scrollable
  >
    <NewPacketCard
      v-model:parent-dialog-active="newPacketDialogVisible"
      @new-packet-saved="loadPackets"
    />
  </v-dialog>

  <v-dialog
    v-model="packetDialogVisible"
    max-width="1000px"
    min-width="450px"
    scrollable
  >
    <PacketCard
      v-model:parentDialogActive="packetDialogVisible"
      :packet-i-d="selectedPacket"
      @packet-saved="loadPackets"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { ClickRowArgument, Header, Item } from "vue3-easy-data-table";
import NewPacketCard from "@/components/NewPacketCard.vue";
import PacketCard from "@/components/PacketCard.vue";
import axios from "axios";
import { Packet } from "messe-lager-dto";

const rowsPerPage = 10000; // "disable" pagination
const searchField = ["number", "company", "location"];
const searchValue = ref("");

const newPacketDialogVisible = ref(false);
const packetDialogVisible = ref(false);
const selectedPacket = ref(0);
const showDestroyedPackets = ref(false);
const items = reactive<Item[]>([]);

const headers: Header[] = [
  { text: "Number", value: "id", sortable: true },
  { text: "Tag", value: "day", sortable: false },
  { text: "Unternehmen", value: "company", sortable: true },
  { text: "Position", value: "location", sortable: true },
];

const showPacketDetails = (item: ClickRowArgument) => {
  selectedPacket.value = item.id;
  packetDialogVisible.value = true;
};

const loadPackets = async () => {
  items.length = 0;

  try {
    items.length = 0;
    const response = await axios.get("/api/packet");

    (response.data as Packet[]).map((packet: Packet) => {
      if (!showDestroyedPackets.value && packet.isDestroyed) {
        return;
      }

      items.push({
        id: packet.id,
        location: packet.location,
        company: `${packet.company.name} (Stand ${packet.company.booth})`,
        day: packet.company.day,
      });
    });
  } catch (e) {
    alert(e);
  }
};

onMounted(loadPackets);
watch(showDestroyedPackets, loadPackets);

let scannerInput = "";
window.onkeypress = (event: KeyboardEvent) => {
  if (event.key == "Enter") {
    const matchedItems = items.filter((i) => i.id === parseInt(scannerInput));

    if (matchedItems.length == 0) {
      console.log("Packet not found: " + scannerInput);
      scannerInput = "";
      return;
    }

    const item = matchedItems[0];
    selectedPacket.value = item.id;
    packetDialogVisible.value = true;
    scannerInput = "";

    event.preventDefault();
  } else if (!isNaN(parseInt(event.key))) {
    scannerInput = scannerInput + event.key;
  }
};
</script>

<style>
@import "../assets/tableStyle.css";

@media screen and (max-width: 700px) {
  #showDestroyedPacketSwitch {
    display: none;
  }
}
</style>
