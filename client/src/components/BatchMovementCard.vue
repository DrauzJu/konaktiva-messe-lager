<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-card :loading="loading">
    <v-toolbar color="primary" :title="cardTitle"></v-toolbar>
    <v-card-text>
      <v-container style="padding: 0">
        <v-row no-gutters>
          <v-col>
            <v-form ref="actorForm" lazy-validation>
              <v-combobox
                v-model="actor"
                label="Helfer"
                :rules="[(v) => !!v || 'Helfer angeben']"
                :items="actorSuggestions"
                :disabled="loading"
                persistent-hint
                clearable
                hide-details
              ></v-combobox>
            </v-form>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-list>
              <v-form ref="locationForm" lazy-validation>
                <div v-for="item in listData" :key="item.key">
                  <v-divider v-if="item.type === 'company'"></v-divider>
                  <v-list-subheader v-if="item.type === 'company'">{{
                    item.name
                  }}</v-list-subheader>
                  <v-list-item v-if="item.type === 'packet'">
                    <v-container style="padding: 0">
                      <v-row no-gutters class="align-center">
                        <v-col>
                          <v-list-item-title>
                            Paket {{ item.data!.id }}
                          </v-list-item-title>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col>
                          <v-text-field
                            v-model="item.data!.location"
                            hide-details
                            label="von/nach Lagerplatz"
                            :rules="[(v) => !!v || 'Lagerplatz angeben']"
                            :disabled="
                              batchMovementType === PacketMovementType.OUT
                            "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item>
                </div>
              </v-form>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        variant="outlined"
        :disabled="loading"
        @click="emit('update:parentDialogActive', false)"
      >
        Abbrechen
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        variant="outlined"
        :disabled="loading || !actor"
        @click="save"
      >
        {{ confirmBtnTitle }}
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-snackbar
    v-model="scannedPacketFailureSnackbar"
    timeout="4000"
    color="error"
    elevation="24"
  >
    <div class="text-center">Paket nicht gefunden!</div>
  </v-snackbar>

  <v-snackbar
    v-model="scannedPacketDuplicateSnackbar"
    timeout="3000"
    color="error"
    elevation="24"
  >
    <div class="text-center">Paket bereits gescannt!</div>
  </v-snackbar>
</template>

<script setup lang="ts">
import axios, { AxiosResponse } from "axios";
import {
  Actor,
  Company,
  CreatePacketMovementParams,
  PacketDetailed,
  PacketMovementType,
} from "messe-lager-dto";
import { computed, onMounted, reactive, ref } from "vue";

const props = defineProps({
  parentDialogActive: { type: Boolean, required: true },
  firstPacketID: { type: Number, required: true },
});

const emit = defineEmits(["update:parentDialogActive", "batchMovementsSaved"]);

const loading = ref(false);
const cardTitle = ref("");
const confirmBtnTitle = ref("");
const actor = ref("");
const actorSuggestions = reactive<Actor[]>([]);
const packetsPerCompany = reactive<Record<string, Array<PacketDetailed>>>({});
const scannedPacketFailureSnackbar = ref(false);
const scannedPacketDuplicateSnackbar = ref(false);
const actorForm = ref(null);
const locationForm = ref(null);

let scannerInput = "";
let batchMovementType: PacketMovementType;
let companyData: Record<string, Company> = {};

const listData = computed(() => {
  const data = [];

  for (const companyID in packetsPerCompany) {
    const companyInfo = companyData[companyID];
    const packetsInWarehouse =
      companyInfo.totalPackets! - companyInfo.packetsNotInWarehouse!;

    data.push({
      type: "company",
      key: `company--${companyInfo.id}`,
      name: `${companyInfo.name} (${packetsInWarehouse}/${companyInfo.totalPackets} im Lager)`,
    });

    const packets = packetsPerCompany[companyID];
    for (const packet of packets) {
      data.push({
        type: "packet",
        key: `packet--${packet.id}`,
        data: packet,
      });
    }
  }

  return data;
});

const save = async () => {
  const actorValidationResult = await actorForm.value.validate();
  const locationValidationResult = await locationForm.value.validate();
  
  if (!actorValidationResult.valid || !locationValidationResult.valid) {
    return;
  }

  loading.value = true;
  const failedOperations: number[] = [];

  for (const companyID in packetsPerCompany) {
    const packets = packetsPerCompany[companyID];
    for (const packet of packets) {
      let data: CreatePacketMovementParams = {
        time: new Date(),
        type: batchMovementType,
        packetId: packet.id,
        actor: actor.value,
        oldLocation: undefined,
        newLocation: undefined,
      };

      if (batchMovementType === PacketMovementType.IN) {
        data.newLocation = packet.location;
      } else {
        data.oldLocation = packet.location;
      }

      try {
        await axios.post("/api/packetMovement", data);
      } catch (e) {
        failedOperations.push(packet.id);
      }
    }
  }

  if (failedOperations.length > 0) {
    alert(`Fehler bei den folgenden Paketen: ${failedOperations.join(",")}!`);
  }

  loading.value = false;
  emit("update:parentDialogActive", false);
  emit("batchMovementsSaved");
};

const addPacket = async (packetID: number) => {
  let packetResponse: AxiosResponse;
  try {
    packetResponse = await axios.get(`/api/packet/${packetID}`);
  } catch (e) {
    scannedPacketFailureSnackbar.value = true;
    return;
  }

  const packetData = packetResponse.data as PacketDetailed;
  const companyId = packetData.company.id.toString();

  // Check if already scanned
  const alreadyScanned = packetsPerCompany[companyId] && packetsPerCompany[companyId].some(
    (elem) => elem.id === packetID
  );

  if (alreadyScanned) {
    console.log(`${packetID} already scanned!`);
    scannedPacketDuplicateSnackbar.value = true;
    return;
  }

  let movementType: PacketMovementType | undefined;

  // Check packet status
  if (packetData.isDestroyed) {
    scannedPacketFailureSnackbar.value = true;
    return;
  }

  // Check movement type
  if (!packetData.location) {
    movementType = PacketMovementType.IN;
  } else {
    movementType = PacketMovementType.OUT;
  }

  if (batchMovementType !== undefined && batchMovementType !== movementType) {
    alert("Ein- und Auslagerungen können nicht gemixt werden!");
    return;
  }

  // Get a suggested location
  let suggestedLocation = "";
  if (movementType === PacketMovementType.IN) {
    const lastMovementWithLocation = packetData.movements.findLast(
      (movement) => movement.newLocation !== null
    );

    suggestedLocation = lastMovementWithLocation?.newLocation ?? "";
  }

  // Store related company data
  // Must be fetched again because statistics are not included in packetData (all values are 0)
  try {
    const companyResponse = await axios.get(
      `/api/company/${companyId}`
    );

    companyData[companyId] = companyResponse.data as Company;
  } catch (e) {
    console.log(e); // Silently ignore
  }

  // Add to list packetsPerCompany
  if (!(companyId in packetsPerCompany)) {
    packetsPerCompany[companyId] = [];
  }

  packetsPerCompany[companyId].push({
    ...packetData,
    location: packetData.location || suggestedLocation,
  });

  return packetData;
};

const setKeypressListener = () => {
  window.onkeypress = async (event: KeyboardEvent) => {
    if (event.key == "Enter" && scannerInput.length >= 4) {
      const enteredPacketID = parseInt(scannerInput.slice(-4), 10);

      loading.value = true;
      await addPacket(enteredPacketID);
      loading.value = false;

      scannerInput = "";
      event.preventDefault();
    } else if (!isNaN(parseInt(event.key))) {
      scannerInput = scannerInput + event.key;
    } else {
      scannerInput = "";
    }
  };
};

onMounted(async () => {
  loading.value = true;
  setKeypressListener();

  const packet = await addPacket(props.firstPacketID);
  if (!packet) {
    throw new Error("BatchMovementCard cannot be instantiated!");
  }

  if (!packet.location) {
    cardTitle.value = "Batch-Einlagerung";
    confirmBtnTitle.value = "Einlagerung ausführen";
    batchMovementType = PacketMovementType.IN;
  } else {
    cardTitle.value = "Batch-Auslagerung";
    confirmBtnTitle.value = "Auslagerung ausführen";
    batchMovementType = PacketMovementType.OUT;
  }

  const actorResponse = await axios.get("/api/actor");
  actorSuggestions.length = 0;
  actorSuggestions.push(...actorResponse.data.map((x: Actor) => x.name));

  loading.value = false;
});
</script>

<style></style>
