<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-container class="fill-height">
    <v-row no-gutters class="align-center">
      <v-col class="mr-2">
        <v-btn id="btn-new-packet" color="secondary" @click="generateTest()">
          Generate test companies
        </v-btn>
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
          sort-by="company"
          class="data-table"
        >
          <template #item-packetsNotInWarehouse="{ packetsNotInWarehouse }">
            <div>
              {{ packetsNotInWarehouse }}
              <v-icon
                v-if="packetsNotInWarehouse > 0"
                end
                icon="mdi-alert"
              ></v-icon>
            </div>
          </template>
        </EasyDataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { Header, Item } from "vue3-easy-data-table";
import { CreateCompanyParams } from "messe-lager-dto";

const rowsPerPage = 10000; // "disable" pagination
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Tag", value: "day", sortable: false },
  { text: "Unternehmen", value: "name", sortable: true },
  { text: "Stand", value: "booth", sortable: true },
  { text: "Anzahl Pakete", value: "totalPackets" },
  { text: "Pakete NICHT im Lager", value: "packetsNotInWarehouse" },
];

const loading = ref(false);
const items = reactive<Item[]>([]);

const loadCompanies = async () => {
  items.length = 0;

  try {
    items.length = 0;
    const response = await axios.get("/api/company");
    items.push(...response.data);
  } catch (e) {
    alert(e);
  }
};

const generateTest = async () => {
  loading.value = true;

  for (let i = 0; i < 10; i++) {
    const data: CreateCompanyParams = {
      id: i,
      name: `Unternehmen ${i + 1}`,
      day: "Di",
      booth: `${i + 1}`,
    };

    try {
      await axios.post("/api/company", data);
    } catch (e) {
      alert(e);
    }
  }

  await loadCompanies();
  loading.value = false;
};

onMounted(async () => {
  loading.value = true;
  await loadCompanies();
  loading.value = false;
});
</script>

<style>
@import "../assets/tableStyle.css";
</style>
