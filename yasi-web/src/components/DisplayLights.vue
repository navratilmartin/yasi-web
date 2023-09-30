<script lang="ts" setup>
import { ref } from 'vue'

interface Light {
        id: string
    }

interface Group {
        id: string
        name: string
        color: string
        lights: Light[]
    }


const props = defineProps<{
  lights: Array<Light>
  title: string
  selectedLights: Array<Light>
}>()

const emit = defineEmits(['updateSelectedLights']);

const selectedLights = ref<Light[]>(props.selectedLights)

const selectLight = (e: any, light: Light) => {
  e.target.classList.contains('selected') ? e.target.classList.remove('selected') : e.target.classList.add('selected')
  selectedLights.value.includes(light) ? selectedLights.value.splice(selectedLights.value.indexOf(light), 1) : selectedLights.value.push(light)
  emit('updateSelectedLights', selectedLights.value)
}

const selectLightText = (e: any, light: Light) => {
  e.target.parentElement.classList.contains('selected') ? e.target.parentElement.classList.remove('selected') : e.target.parentElement.classList.add('selected')
  selectedLights.value.includes(light) ? selectedLights.value.splice(selectedLights.value.indexOf(light), 1) : selectedLights.value.push(light)
  emit('updateSelectedLights', selectedLights.value)
  }

// TODO
// lepsi highlighting - takto nefunguje kdyz zapnu
</script>

<template>
    <h4 class="ml-2 my-2">{{ props.title }}</h4>
      <v-card v-for="light in lights" :key="light.id"
      class="mb-3 bg-white rounded elevation-0"
      :class="{'selected': selectedLights.includes(light)}"
        @click="selectLight($event, light)" 
        >
        <v-card-title class="d-flex">
          <!-- <img src="@/assets/marker.svg" 
          alt="marker"
          height="30"> -->
          <p @click.stop="selectLightText($event, light)" class="ml-4">{{ light.id }}</p>
        </v-card-title>
      </v-card>
</template>

<style>

.selected {
  background-color:rgba(5, 122, 239, 0.2);
  /* color: white; */
  border: 2px solid #2F7CC9;
}

</style>