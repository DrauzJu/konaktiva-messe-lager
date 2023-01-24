<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-card :loading="loading">
    <v-toolbar color="primary" title="Neues Paket"></v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="validForm" lazy-validation>
        <v-autocomplete
          v-model="selectedCompany"
          label="Unternehmen"
          :items="companies"
          item-title="name"
          item-value="id"
          :rules="[(v) => v != null || 'Bitte Unternehmen angeben']"
          :disabled="loading"
          persistent-hint
          clearable
        ></v-autocomplete>
        <v-divider></v-divider>
        <v-text-field
          v-model="selectedLocation"
          label="Lagerplatz"
          :rules="[(v) => !!v || 'Bitte Lagerplatz angeben']"
          :disabled="loading"
          persistent-hint
          clearable
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" @click="emit('update:parentDialogActive', false)"
        >Abbrechen</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="Secondary" :disabled="!validForm || loading" @click="save"
        >Speichern und Label drucken</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import axios from "axios";
import { Company, CreatePacketParams, Packet } from "messe-lager-dto";
import { onMounted, reactive, ref, watch } from "vue";
import printLabel from "../dymo/print";

defineProps({
  parentDialogActive: { type: Boolean, required: true },
});

const emit = defineEmits(["update:parentDialogActive", "newPacketSaved"]);

const loading = ref(false);
const validForm = ref(false);
const selectedCompany = ref<number>();
const selectedLocation = ref<string>("");
const companies = reactive<Company[]>([]);

watch(selectedCompany, async (newValue) => {
  if (newValue === null) {
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(
      `/api/company/${selectedCompany.value}/mainLocation`
    );
    selectedLocation.value = response.data.location;
  } catch (e) {
    alert(e);
  }

  loading.value = false;
});

const save = async () => {
  const data: CreatePacketParams = {
    companyId: selectedCompany.value!,
    location: selectedLocation.value,
  };

  try {
    const response = await axios.post("/api/packet", data);
    const newPacket = response.data as Packet;

    await printLabel(newPacket.id, newPacket.company.name);
  } catch (e) {
    alert(e);
  }

  emit("update:parentDialogActive", false);
  emit("newPacketSaved");
};

const loadCompanies = async () => {
  companies.length = 0;

  try {
    companies.length = 0;
    const response = await axios.get("/api/company");
    companies.push(...response.data);
  } catch (e) {
    alert(e);
  }
};

onMounted(async () => {
  loading.value = true;
  await loadCompanies();
  loading.value = false;
});
</script>

<style></style>
