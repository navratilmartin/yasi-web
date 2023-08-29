<template>
  <v-container class="d-flex justify-center">
    <v-btn @click="isVisible = !isVisible">{{ isVisible === true ? 'hide' : 'show' }}</v-btn>
  </v-container>
  <section v-if="isVisible">
    <v-sheet
    class="mx-auto"
    elevation="8"
    max-width="800"
  >
    <v-slide-group
      v-model="model"
      class="pa-4"
      selected-class="bg-success"
      show-arrows
    >
      <v-slide-group-item
        v-for="n in 15"
        :key="n"
        v-slot="{ isSelected, toggle, selectedClass }"
      >
        <v-card
          color="grey-lighten-1"
          :class="['ma-4', selectedClass]"
          height="200"
          width="100"
          @click="toggle"
        >
          <div class="d-flex fill-height align-center justify-center">
            <v-scale-transition>
              <v-icon
                v-if="isSelected"
                color="white"
                size="48"
                icon="mdi-close-circle-outline"
              ></v-icon>
            </v-scale-transition>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const model = ref<number[]>([])
console.log(model.value)
const isVisible = ref(true)
</script>

<style scoped>

section {
  color: red;
  display: grid;
  place-items: center;
  justify-content: center;
  min-height: 100vh;

  /* filter: blur(5px); */
  /* transform: translateY(-100%); */
  animation: all 1s;
}

@keyframes all {
  0% {
    opacity: 0;
    filter: blur(5px);
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateX(0);
  }
}

</style>
