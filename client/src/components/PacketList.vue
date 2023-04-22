<template>
  <v-container>
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
    @click:outside="loadPackets()"
  >
    <PacketCard
      v-model:parentDialogActive="packetDialogVisible"
      :packet-i-d="selectedPacket"
      @card-closed="loadPackets"
    />
  </v-dialog>

  <v-dialog
    v-model="batchMovementDialogVisible"
    max-width="600px"
    min-width="450px"
    scrollable
  >
    <BatchMovementCard
      v-model:parent-dialog-active="batchMovementDialogVisible"
      v-model:firstPacketID="batchMovementStartPacket"
      @batch-movements-saved="loadPackets"
    />
  </v-dialog>

  <v-snackbar
    v-model="scannedPacketFailureSnackbar"
    timeout="4000"
    color="error"
    elevation="24"
  >
    <div class="text-center">Paket nicht gefunden!</div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { ClickRowArgument, Header, Item } from "vue3-easy-data-table";
import NewPacketCard from "@/components/NewPacketCard.vue";
import PacketCard from "@/components/PacketCard.vue";
import BatchMovementCard from "@/components/BatchMovementCard.vue";
import axios from "axios";
import { Packet } from "messe-lager-dto";

const rowsPerPage = 10000; // "disable" pagination
const searchField = ["id", "company", "location"];
const searchValue = ref("");

const newPacketDialogVisible = ref(false);
const packetDialogVisible = ref(false);
const batchMovementDialogVisible = ref(false);
const selectedPacket = ref(0);
const showDestroyedPackets = ref(false);
const items = reactive<Item[]>([]);
const batchMovementStartPacket = ref(0);
const scannedPacketFailureSnackbar = ref(false);

let scannerInput = "";

const headers: Header[] = [
  { text: "Nummer", value: "id", sortable: true },
  { text: "Tag", value: "day", sortable: true },
  { text: "Unternehmen", value: "company", sortable: true },
  { text: "Position", value: "location", sortable: true },
];

const showPacketDetails = (item: ClickRowArgument) => {
  selectedPacket.value = item.id;
  packetDialogVisible.value = true;
};

const loadPackets = async () => {
  try {
    items.length = 0;
    const response = await axios.get("/api/packet");

    (response.data as Packet[]).map((packet: Packet) => {
      if (!showDestroyedPackets.value && packet.isDestroyed) {
        return;
      }

      items.push({
        id: packet.id,
        location: packet.isDestroyed ? "ZERSTÖRT" : packet.location,
        company: `${packet.company.name} (Stand ${packet.company.booth})`,
        day: packet.company.day,
        isDestroyed: packet.isDestroyed,
      });
    });
  } catch (e) {
    alert(e);
  }
};

const setKeypressListener = () => {
  scannerInput = "";

  window.onkeypress = (event: KeyboardEvent) => {
    if (event.key == "Enter" && scannerInput.length >= 4) {
      const enteredPacketID = parseInt(scannerInput.slice(-4), 10);

      const matchedItems = items.filter(
        (i) => i.id === enteredPacketID && !i.isDestroyed
      );

      if (matchedItems.length == 0) {
        scannedPacketFailureSnackbar.value = true;
        scannerInput = "";
        return;
      }

      const item = matchedItems[0];
      batchMovementStartPacket.value = item.id;
      batchMovementDialogVisible.value = true;

      scannerInput = "";
      event.preventDefault();
    } else if (!isNaN(parseInt(event.key))) {
      scannerInput = scannerInput + event.key;
    } else {
      scannerInput = "";
    }
  };
};

onMounted(() => {
  loadPackets();
  setKeypressListener();
});

watch(showDestroyedPackets, loadPackets);
watch(batchMovementDialogVisible, setKeypressListener);
</script>

<style>
@import "../assets/tableStyle.css";

@media screen and (max-width: 700px) {
  #showDestroyedPacketSwitch {
    display: none;
  }
}
</style>
