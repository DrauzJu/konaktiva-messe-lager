<template>
  <v-overlay :model-value="loading" class="align-center justify-center"></v-overlay>
  <v-card :loading="loading">
    <v-toolbar
      color="primary"
      title="Neues Paket"
    ></v-toolbar>
    <v-card-text>
      <v-form
        ref="form"
        v-model="validForm"
        lazy-validation
      >
        <v-autocomplete
          label="Unternehmen"
          :items="companies"
          :rules="[v => !!v || 'Bitte Unternehmen angeben']"
          v-model="selectedCompany"
          :disabled="loading"
          persistent-hint
          clearable
        ></v-autocomplete>
        <v-divider></v-divider>
        <v-text-field
          label="Lagerplatz"
          :rules="[v => !!v || 'Bitte Lagerplatz angeben']"
          v-model="selectedLocation"
          :disabled="loading"
          persistent-hint
          clearable
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        @click="emit('update:parentDialogActive', false)"
      >Abbrechen</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="Secondary"
        :disabled="!validForm || loading"
        @click="emit('update:parentDialogActive', false)"
      >Speichern und Label drucken</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps({
  parentDialogActive: { type: Boolean, required: true },
});

const emit = defineEmits(['update:parentDialogActive'])

const loading = ref(false);
const validForm = ref(false);
const selectedCompany = ref<string>("");
const selectedLocation = ref<string>("");

const companies = ['Company A', 'Company B'];

watch(selectedCompany, (newValue) => {
  if(newValue === null || newValue.length === 0) {
    return;
  }

  loading.value = true;
  setTimeout(() => {
    selectedLocation.value = 'A' + Math.floor(Math.random() * 10);

    loading.value = false;
  }, 1000);
});

</script>

<style>

</style>
