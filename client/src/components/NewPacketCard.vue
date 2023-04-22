<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-card :loading="loading">
    <v-toolbar color="primary" title="Neue Pakete"></v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="validForm" lazy-validation>
        <v-select
          v-model="selectedAmount"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="Anzahl"
        ></v-select>
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
        <v-text-field
          v-model.trim="selectedLocation"
          label="Lagerplatz"
          :rules="[(v) => !!v || 'Bitte Lagerplatz angeben']"
          :disabled="loading"
          persistent-hint
          clearable
          @change="onSelectedLocationChange"
        ></v-text-field>
        <div class="mb-3">
          <span class="subheading">Andere Pakete auf diesem Lagerplatz: </span>
          <v-chip-group v-if="packetsOnSameLocation.length > 0" column>
            <v-chip v-for="packet in packetsOnSameLocation" :key="packet">
              {{ packet }}
            </v-chip>
          </v-chip-group>
          <span v-else>Keine!</span>
        </div>
        <v-textarea
          v-model="comment"
          placeholder="Kommentare hier eingeben..."
          auto-grow
          prepend-inner-icon="mdi-comment"
        ></v-textarea>
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
const selectedAmount = ref<number>(1);
const selectedCompany = ref<number>();
const selectedLocation = ref<string>("");
const comment = ref<string>("");
const companies = reactive<Company[]>([]);
const packetsOnSameLocation = reactive<string[]>([]);

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

  await onSelectedLocationChange();

  loading.value = false;
});

const onSelectedLocationChange = async () => {
  if (!selectedLocation.value) {
    packetsOnSameLocation.length = 0;
    return;
  }

  loading.value = true;
  packetsOnSameLocation.length = 0;

  try {
    const response = await axios.get(`/api/packet`, {
      params: {
        location: selectedLocation.value,
      },
    });
    (response.data as Packet[]).map((packet: Packet) => {
      if (packet.isDestroyed) {
        return;
      }

      packetsOnSameLocation.push(`Paket ${packet.id} (${packet.company.name})`);
    });
  } catch (e) {
    alert(e);
  }

  loading.value = false;
};

const save = async () => {
  const data: CreatePacketParams = {
    companyId: selectedCompany.value!,
    location: selectedLocation.value,
    comment: comment.value,
  };

  const totalPackets = selectedAmount.value;
  let createdPackets = 0;

  try {
    for (let i = 0; i < totalPackets; i++) {
      const response = await axios.post("/api/packet", data);
      const newPacket = response.data as Packet;

      createdPackets++;

      try {
        await printLabel(newPacket.id, newPacket.company.name);
      } catch (e) {
        alert("Error printing label!");
      }
    }
  } catch (e) {
    alert(
      `Error saving new packet. ${createdPackets} out of ${totalPackets} created successfully.`
    );
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
