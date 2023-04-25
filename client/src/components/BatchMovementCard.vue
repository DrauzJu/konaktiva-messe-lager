<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-card :loading="loading">
    <v-toolbar color="primary" :title="'Batch-' + mvTypeText"></v-toolbar>
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
            <v-alert type="info" class="mt-3">
              {{ mvTypeText }} für: {{ companyData.name }} (Stand
              {{ companyData.booth }})
            </v-alert>
            <v-list>
              <v-form ref="locationForm" lazy-validation>
                <div v-for="item in packets" :key="item.id">
                  <v-list-item
                    v-if="!item.isDestroyed"
                    :class="{ 'text-disabled': !item.scanned }"
                  >
                    <v-container style="padding: 0">
                      <v-row no-gutters class="align-center">
                        <v-col cols="4">
                          <v-list-item-title>
                            {{ item.scanned ? "&#9989; " : "&#10060; " }}
                            Paket {{ item.id }}
                          </v-list-item-title>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="5">
                          <v-text-field
                            v-if="item.scanned"
                            v-model="item.location"
                            hide-details
                            label="von/nach Lagerplatz"
                            :rules="[(v) => !!v || 'Lagerplatz angeben']"
                            :disabled="
                              batchMovementType === PacketMovementType.OUT
                            "
                          ></v-text-field>
                          <div v-else-if="batchMovementType === PacketMovementType.IN && !item.location">
                            Paket beim Unternehmen!
                          </div>
                          <div v-else-if="batchMovementType === PacketMovementType.IN && !!item.location">
                            Paket schon eingelagert ({{ item.location }})
                          </div>
                          <div v-else-if="batchMovementType === PacketMovementType.OUT && !item.location">
                            Paket schon ausgelagert
                          </div>
                          <div v-else-if="batchMovementType === PacketMovementType.OUT && !!item.location">
                            Paket im Lager
                          </div>
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
        {{ mvTypeText }} ausführen
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
    timeout="2000"
    color="error"
    elevation="24"
  >
    <div class="text-center">Paket bereits gescannt!</div>
  </v-snackbar>

  <v-snackbar
    v-model="scannedPacketInvalidCompany"
    timeout="4000"
    color="error"
    elevation="24"
  >
    <div class="text-center">
      Paket nicht gefunden - Falsche ID oder anderes Unternehmen!
    </div>
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
import { onMounted, reactive, ref } from "vue";
import { VForm } from "vuetify/components";

type BatchPacket = PacketDetailed & {
  scanned: boolean;
};

const props = defineProps({
  parentDialogActive: { type: Boolean, required: true },
  firstPacketID: { type: Number, required: true },
});

const emit = defineEmits(["update:parentDialogActive", "batchMovementsSaved"]);

const loading = ref(false);
const mvTypeText = ref("");
const actor = ref("");
const actorSuggestions = reactive<Actor[]>([]);

const packets = reactive<BatchPacket[]>([]);
const companyData = reactive<Company>({
  id: 0,
  booth: "",
  day: "",
  name: "",
  packets: [],
});

const actorForm = ref<VForm | null>(null);
const locationForm = ref<VForm | null>(null);

const scannedPacketFailureSnackbar = ref(false);
const scannedPacketDuplicateSnackbar = ref(false);
const scannedPacketInvalidCompany = ref(false);

let scannerInput = "";
let batchMovementType: PacketMovementType;

const save = async () => {
  // Maybe refs need some time?!
  if (actorForm.value === null || locationForm.value === null) {
    return;
  }

  const actorValidationResult = await actorForm.value.validate();
  const locationValidationResult = await locationForm.value.validate();

  if (!actorValidationResult.valid || !locationValidationResult.valid) {
    return;
  }

  loading.value = true;
  const failedOperations: number[] = [];

  for (const packet of packets) {
    // Do nothing for packets which are not scanned
    if (!packet.scanned) {
      continue;
    }

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

  if (failedOperations.length > 0) {
    alert(`Fehler bei den folgenden Paketen: ${failedOperations.join(",")}!`);
  }

  loading.value = false;
  emit("update:parentDialogActive", false);
  emit("batchMovementsSaved");
};

const addPacket = async (packetID: number) => {
  const packet = packets.find((p) => p.id === packetID);

  if (!packet) {
    scannedPacketInvalidCompany.value = true;
    return;
  }

  // Check if already scanned
  if (packet.scanned) {
    scannedPacketDuplicateSnackbar.value = true;
    return;
  }

  // Check packet status
  if (packet.isDestroyed) {
    scannedPacketFailureSnackbar.value = true;
    return;
  }

  // Check movement type
  let movementType: PacketMovementType;
  if (!packet.location) {
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
    const lastMovementWithLocation = packet.movements.findLast(
      (movement) => movement.newLocation !== null
    );

    suggestedLocation = lastMovementWithLocation?.newLocation ?? "";
  }

  // Update packet
  packet.scanned = true;
  packet.location = suggestedLocation || packet.location;
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

  let packetResponse: AxiosResponse;
  try {
    packetResponse = await axios.get(`/api/packet/${props.firstPacketID}`);
  } catch (e) {
    scannedPacketFailureSnackbar.value = true;
    return;
  }

  const packet = packetResponse.data as PacketDetailed;

  try {
    const companyResponse = await axios.get(
      `/api/company/${packet.company.id}`
    );
    Object.assign(companyData, companyResponse.data as Company);
  } catch (e) {
    throw new Error("BatchMovementCard cannot be instantiated!");
  }

  packets.length = 0;
  packets.push(
    ...companyData.packets.map((p) => {
      return { ...p, scanned: false };
    })
  );

  await addPacket(props.firstPacketID);

  if (!packet.location) {
    mvTypeText.value = "Einlagerung";
    batchMovementType = PacketMovementType.IN;
  } else {
    mvTypeText.value = "Auslagerung";
    batchMovementType = PacketMovementType.OUT;
  }

  const actorResponse = await axios.get("/api/actor");
  actorSuggestions.length = 0;
  actorSuggestions.push(...actorResponse.data.map((x: Actor) => x.name));

  loading.value = false;
});
</script>

<style></style>
