<template>
  <div class="background-image">
  <v-container class="d-flex justify-center">
    <v-btn @click="isVisible = !isVisible">{{ isVisible === true ? 'hide' : 'show' }}</v-btn>
  </v-container>
  <section id="gym" v-if="isVisible" class="d-flex flex-column">
    <h1>Gym</h1>
    <v-sheet
    class="mx-auto"
    elevation="8"
    max-width="80vw"
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
          height="250"
          width="200"
          @click="[toggle(), print(model)]"
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

  <section id="jidlo" v-if="isVisible" class="d-flex flex-column">
    <h1>Jidlo</h1>
    <v-sheet
    class="mx-auto"
    elevation="8"
    max-width="80vw"
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
          height="250"
          width="200"
          @click="[toggle(), print(model)]"
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
</div>
</template>

<script setup lang="ts">

import {ref} from 'vue'

const print = (x: any) => console.log(model.value)
const model = ref<number[]>([])
console.log(model.value)
const isVisible = ref(true)

</script>

<style scoped>

h1 {
  font-size: 50px;
  font-family: 'Sans-serif';
  color: black;
  margin: 20px;
}

section {
  color: red;
  display: grid;
  place-items: center;
  justify-content: top;
  margin-bottom: 200px;

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

.background-image {
  background-image: url("../assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

</style>
``