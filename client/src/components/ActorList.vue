<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  ></v-overlay>
  <v-container>
    <v-row no-gutters class="align-center">
      <v-col class="mr-2">
        <div>Wird nur für Eingabe-Vorschläge genutzt!</div>
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col cols="5">
        <v-text-field
          v-model="newActorName"
          label="Neuer Helfer"
          persistent-hint
          clearable
          hide-details
          @keydown.enter="createActor"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn color="primary" :disabled="loading" @click="createActor"
          >Hinzufügen</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list lines="two">
          <v-list-item
            v-for="actor in actors"
            :key="actor.id"
            :title="actor.name"
          >
            <template #append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-close"
                variant="text"
                @click="deleteActor(actor.id)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { Item } from "vue3-easy-data-table";
import { CreateActorParams } from "messe-lager-dto";

const loading = ref(false);
const actors = reactive<Item[]>([]);
const newActorName = ref("");

const deleteActor = async (id: number) => {
  loading.value = true;

  try {
    await axios.delete(`/api/actor/${id}`);
  } catch (e) {
    alert(e);
  }

  await loadActors();
  loading.value = false;
};

const loadActors = async () => {
  loading.value = true;

  try {
    actors.length = 0;
    const response = await axios.get("/api/actor");
    actors.push(...response.data);
  } catch (e) {
    alert(e);
  }

  loading.value = false;
};

const createActor = async () => {
  if (newActorName.value === "") {
    alert("Bitte Name eingeben!");
    return;
  }

  loading.value = true;

  try {
    await axios.post("/api/actor", {
      name: newActorName.value,
    } as CreateActorParams);
  } catch (e) {
    alert("Fehler" + e);
  }

  loading.value = false;
  newActorName.value = "";

  await loadActors();
};

onMounted(loadActors);
</script>
