<template>
  <v-overlay :model-value="loading" class="align-center justify-center"></v-overlay>
  <v-card :loading="loading">
    <v-toolbar
      color="primary"
      :title="'Paket ' + packetID"
    ></v-toolbar>
    <v-card-text>
      <v-container class="pt-0 pb-0">
        <v-row align="center">
          <v-col cols="8">
            <div>Unternehmen: {{  packet.company }}</div>
            <div>Tag: {{  packet.day }}</div>
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
            {{  packet.location || "n/a" }}
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-btn-toggle
        v-model="selectedAction"
        divided
      >
        <v-btn value="moveIn" :disabled="packet.location.length > 0">
          <span class="hidden-sm-and-down">Einlagern</span>
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn value="moveOut" :disabled="packet.location.length === 0">
          <span class="hidden-sm-and-down">Auslagern</span>
          <v-icon end>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn value="moveLocation" :disabled="packet.location.length === 0">
          <span class="hidden-sm-and-down">Umlagern</span>
          <v-icon end icon="mdi-sync"></v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-container>
        <v-row v-if="selectedAction === 'moveIn'">
          <v-col>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                label="Lagerplatz"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
              <v-text-field
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
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
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
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                label="Neuer Lagerplatz"
                :disabled="loading"
                persistent-hint
                clearable
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels class="mt-8">
        <v-expansion-panel title="Details">
          <v-expansion-panel-text>Spediteur, ...</v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Paketbewegungen">
          <v-expansion-panel-text>
            <v-timeline
              side="end"
              truncate-line="start"
            >
              <v-timeline-item
                v-for="item in movements"
                :key="item.ID"
                :dot-color="getMovementColor(item)"
                size="small"
              >
                <template v-slot:opposite>
                  <div>{{ item.time.toISOString() }}</div>
                </template>

                <div>
                  <div class="text-h6" v-if="item.type === PacketMovementType.IN">Einlagerung</div>
                  <div class="text-h6" v-if="item.type === PacketMovementType.OUT">Auslagerung</div>
                  <div class="text-h6" v-if="item.type === PacketMovementType.LOCATION_CHANGE">Umlagerung</div>
                  <p>Pate: {{ item.actor }}</p>
                  <p v-if="item.type === PacketMovementType.IN">Lagerplatz: {{ item.newLocation }}</p>
                  <p v-if="item.type === PacketMovementType.LOCATION_CHANGE">
                    Lagerplatz: {{ item.oldLocation }} nach {{ item.newLocation }}
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
      >Abbrechen</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="Secondary"
        variant="outlined"
        :disabled="loading"
        @click="emit('update:parentDialogActive', false)"
      >Etikett drucken</v-btn>
      <v-btn
        color="success"
        variant="outlined"
        :disabled="loading || !selectedAction || selectedAction.length === 0"
        @click="emit('update:parentDialogActive', false)"
      >{{ saveButtonText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import Packet from '@/data/Packet';
import { PacketMovement, PacketMovementType } from '@/data/PacketMovement';
import { onMounted, reactive, ref, computed } from 'vue';

const props = defineProps({
  parentDialogActive: { type: Boolean, required: true },
  packetID: { type: Number, required: true }
});

const emit = defineEmits(['update:parentDialogActive'])

const packet: Packet = reactive(new Packet(props.packetID, "", "", ""));
const loading = ref(false);
const selectedAction = ref<string>();
const movements: PacketMovement[] = reactive<PacketMovement[]>([]);

const saveButtonText = computed(() => {
  if(!selectedAction.value) {
    return "Speichern";
  }

  switch(selectedAction.value) {
    case "moveIn": return "Einlagern";
    case "moveOut": return "Auslagern";
    case "moveLocation": return "Umlagern";
    default: return "Speichern";
  }
});

const getMovementColor = (movement: PacketMovement) => {
  switch(movement.type) {
    case PacketMovementType.IN: return "success";
    case PacketMovementType.OUT: return "error";
    case PacketMovementType.LOCATION_CHANGE: return "info";
  }
}

onMounted(() => {
  packet.company = "Bosch Rexroth";
  packet.day = "Mittwoch";
  packet.location = "A7";

  movements.push(new PacketMovement(
    0,
    packet,
    new Date(2022,11,24,8,20),
    PacketMovementType.IN,
    "",
    "A7",
    "Jakob F."
  ));

  movements.push(new PacketMovement(
    1,
    packet,
    new Date(2022,11,24,9,20),
    PacketMovementType.OUT,
    "A7",
    "",
    "Jakob F."
  ));

  movements.push(new PacketMovement(
    2,
    packet,
    new Date(2022,11,24,9,30),
    PacketMovementType.IN,
    "",
    "A8",
    "Jakob F."
  ));

  movements.push(new PacketMovement(
    3,
    packet,
    new Date(2022,11,24,10,30),
    PacketMovementType.LOCATION_CHANGE,
    "A8",
    "A7",
    "Jakob F."
  ));

  loading.value = true;
  setTimeout(() => loading.value = false, 1000);

  // Default actions
  if(packet.location.length === 0) {
    selectedAction.value = "moveIn";
  } else {
    selectedAction.value = "moveOut";
  }
});

</script>

<style>
</style>
