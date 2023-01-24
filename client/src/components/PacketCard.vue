<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-card :loading="loading">
    <v-toolbar color="primary" :title="'Paket #' + packetID"></v-toolbar>
    <v-card-text>
      <v-container class="pt-0 pb-0">
        <v-row align="center">
          <v-col cols="8">
            <div>Unternehmen: {{ packet.company.name }}</div>
            <div>Stand: {{ packet.company.booth }}</div>
            <div>Tag: {{ packet.company.day }}</div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">Lagerplatz:</v-col>
          <v-col cols="2">
            <v-sheet
              color="grey-lighten-3"
              elevation="12"
              rounded="xl"
              class="pa-4 d-flex justify-center align-center font-weight-bold text-h6"
              height="100px"
              width="100px"
            >
              {{ packet.location || "n/a" }}
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-btn-toggle v-model="selectedAction" divided>
        <v-btn
          value="moveIn"
          :disabled="packet.location !== null && packet.location.length > 0"
          variant="outlined"
          color="primary"
        >
          <span class="hidden-sm-and-down">Einlagern</span>
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn
          value="moveOut"
          :disabled="packet.location === null || packet.location.length === 0"
          variant="outlined"
          color="primary"
        >
          <span class="hidden-sm-and-down">Auslagern</span>
          <v-icon end>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
          value="moveLocation"
          :disabled="packet.location === null || packet.location.length === 0"
          variant="outlined"
          color="primary"
        >
          <span class="hidden-sm-and-down">Umlagern</span>
          <v-icon end icon="mdi-sync"></v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-container>
        <v-row v-if="selectedAction === 'moveIn'">
          <v-col>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="actionMoveInLocation"
                label="Lagerplatz"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
              <v-text-field
                v-model="actionMoveInActor"
                label="Pate"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row v-if="selectedAction === 'moveOut'">
          <v-col>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="actionMoveOutActor"
                label="Pate"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row v-if="selectedAction === 'moveLocation'">
          <v-col>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="actionChangeLocationLocation"
                label="Neuer Lagerplatz"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels class="mt-8" multiple>
        <v-expansion-panel title="Details">
          <v-expansion-panel-text>Spediteur, ...</v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Paketbewegungen">
          <v-expansion-panel-text>
            <v-timeline side="end" truncate-line="start">
              <v-timeline-item
                v-for="item in packet.movements"
                :key="item.id"
                :dot-color="getMovementColor(item)"
                size="small"
              >
                <template #opposite>
                  <div>{{ item.time }}</div>
                </template>

                <div>
                  <div
                    v-if="item.type === PacketMovementType.IN"
                    class="text-h6"
                  >
                    Einlagerung
                  </div>
                  <div
                    v-if="item.type === PacketMovementType.OUT"
                    class="text-h6"
                  >
                    Auslagerung
                  </div>
                  <div
                    v-if="item.type === PacketMovementType.LOCATION_CHANGE"
                    class="text-h6"
                  >
                    Umlagerung
                  </div>
                  <p>Pate: {{ item.actor }}</p>
                  <p v-if="item.type === PacketMovementType.IN">
                    Lagerplatz: {{ item.newLocation }}
                  </p>
                  <p v-if="item.type === PacketMovementType.LOCATION_CHANGE">
                    Lagerplatz: {{ item.oldLocation }} nach
                    {{ item.newLocation }}
                  </p>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        variant="outlined"
        :disabled="loading"
        @click="emit('update:parentDialogActive', false)"
        >Abbrechen</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn
        color="Secondary"
        variant="outlined"
        :disabled="loading"
        @click="printLabelWrapped()"
        >Etikett drucken</v-btn
      >
      <v-btn
        color="success"
        variant="outlined"
        :disabled="loading || !selectedAction || selectedAction.length === 0"
        @click="save"
        >{{ saveButtonText }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import {
  CreatePacketMovementParams,
  PacketDetailed,
  PacketMovement,
  PacketMovementType,
} from "messe-lager-dto";
import axios from "axios";
import printLabel from "../dymo/print";

const props = defineProps({
  parentDialogActive: { type: Boolean, required: true },
  packetID: { type: Number, required: true },
});

const emit = defineEmits(["update:parentDialogActive", "packetSaved"]);

const loading = ref(false);
const selectedAction = ref<string>();
const actionMoveInActor = ref<string>();
const actionMoveInLocation = ref<string>();
const actionMoveOutActor = ref<string>();
const actionChangeLocationLocation = ref<string>();
const packet: PacketDetailed = reactive({
  id: 0,
  company: {
    id: 0,
    day: "",
    name: "",
    booth: "",
    packets: [],
  },
  location: "",
  movements: [],
});

const saveButtonText = computed(() => {
  if (!selectedAction.value) {
    return "Speichern";
  }

  switch (selectedAction.value) {
    case "moveIn":
      return "Einlagern";
    case "moveOut":
      return "Auslagern";
    case "moveLocation":
      return "Umlagern";
    default:
      return "Speichern";
  }
});

const getMovementColor = (movement: PacketMovement) => {
  switch (movement.type) {
    case PacketMovementType.IN:
      return "success";
    case PacketMovementType.OUT:
      return "error";
    case PacketMovementType.LOCATION_CHANGE:
      return "info";
  }
};

const printLabelWrapped = async () => {
  try {
    loading.value = true;
    await printLabel(packet.id, packet.company.name);
  } catch (e) {
    alert("Error while printing label!");
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  let data: CreatePacketMovementParams;

  switch (selectedAction.value) {
    case "moveIn":
      data = {
        time: new Date(),
        type: PacketMovementType.IN,
        packetId: props.packetID,
        oldLocation: undefined,
        newLocation: actionMoveInLocation.value,
        actor: actionMoveInActor.value,
      };

      break;
    case "moveOut":
      data = {
        time: new Date(),
        type: PacketMovementType.OUT,
        packetId: props.packetID,
        oldLocation: packet.location,
        newLocation: undefined,
        actor: actionMoveOutActor.value,
      };

      break;
    case "moveLocation":
      data = {
        time: new Date(),
        type: PacketMovementType.LOCATION_CHANGE,
        packetId: props.packetID,
        oldLocation: packet.location,
        newLocation: actionChangeLocationLocation.value,
        actor: undefined,
      };

      break;
    default:
      return;
  }

  try {
    await axios.post("/api/packetMovement", data);
  } catch (e) {
    alert(e);
    return;
  }

  emit("update:parentDialogActive", false);
  emit("packetSaved");
};

onMounted(async () => {
  loading.value = true;

  try {
    const response = await axios.get(`/api/packet/${props.packetID}`);
    Object.assign(packet, response.data as PacketDetailed);
  } catch (e) {
    alert(e);
  }

  // Default actions
  if (packet.location === null || packet.location.length === 0) {
    selectedAction.value = "moveIn";

    const lastMovementWithLocation = packet.movements.findLast(
      (movement) => movement.newLocation !== null
    );

    if (lastMovementWithLocation) {
      actionMoveInLocation.value = lastMovementWithLocation.newLocation;
    }
  } else {
    selectedAction.value = "moveOut";
  }

  loading.value = false;
});
</script>

<style></style>
