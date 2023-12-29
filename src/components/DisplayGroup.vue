<script lang="ts" setup>
import { computed } from 'vue';
import { ref, onMounted } from 'vue'

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
  group: Group
  selectedLights: Array<{light: Light, groupName: string}>
}>()


const lightsWithClass = computed(() => {
  return props.group.lights.map((light: Light) => {
    return {
      content: light,
      class: selectedLights.value.includes(light) ? true :false
    }
  })
})

const emit = defineEmits(['updateSelectedLights']);

const actualGroupName = ref<string>(props.group.name)
const selectedLights = ref<Light[]>(props.selectedLights.map(l => l.light))

const selectLight = (e: any, light: Light) => {
  const selectedLight = {
    light: light,
    groupName: actualGroupName.value}
  console.log('before', e.target.classList)
  e.target.classList.contains('selected') ? e.target.classList.remove('selected') : e.target.classList.add('selected')
  console.log(selectedLights.value)
  const sel = props.selectedLights.map(l => l.light)
  const alreadyExistingLight = sel.find(l => l.id === light.id ) 
  alreadyExistingLight === undefined ? props.selectedLights.push(selectedLight) : props.selectedLights.splice(selectedLights.value.indexOf(alreadyExistingLight), 1) 
  console.log('spatne', alreadyExistingLight)
  props.group.lights.find(l => l.id === light.id)
  console.log(props.selectedLights)
  
  emit('updateSelectedLights', props.selectedLights)
  console.log(e.target.classList)
}

const selectLightText = (e: any, light: Light) => {
  e.target.parentElement.classList.contains('selected') ? e.target.parentElement.classList.remove('selected') : e.target.parentElement.classList.add('selected')
  const alreadyExistingLight = selectedLights.value.find(l => l.id === light.id ) 
  alreadyExistingLight === undefined ? selectedLights.value.push(light) : selectedLights.value.splice(selectedLights.value.indexOf(alreadyExistingLight), 1) 
  emit('updateSelectedLights', selectedLights.value)
  }

const lightRefs = ref<HTMLElement[]>([])


onMounted(() => {
  lightRefs.value.forEach((lightRef: HTMLElement) => {
    console.log(lightRef)
    if (selectedLights.value.find(l => l.id === lightRef.innerText)) {
      lightRef.classList.add('selected')
    }
  })
})

// TODO
// lepsi highlighting - takto nefunguje kdyz zapnu
</script>

<template>
    <h4 class="ml-2 my-2">{{ props.group.name }}</h4>
      <v-card v-for="light in lightsWithClass" :key="light.content.id" ref="lightRefs"
      class="x mb-3 bg-white rounded elevation-0"
      :class="{ 'selected': light.class }"
        @click="selectLight($event, light.content)" 
        >
        <v-card-title class="d-flex">
          <!-- <img src="@/assets/marker.svg" 
          alt="marker"
          height="30"> -->
          <p @click.stop="selectLightText($event, light.content)" class="ml-4">{{ light.content.id }}</p>
        </v-card-title>
      </v-card>
</template>

<style>

.selected {
  background-color:rgba(5, 122, 239, 0.2);
  /* color: white; */
  border: 2px solid #2F7CC9;
}

.x {
  color: red;
}

</style>