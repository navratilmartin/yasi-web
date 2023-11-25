<template>

<v-row>
  <v-col cols="8">
  </v-col>
  <v-col cols="4">
    <v-expansion-panels class="ma-5">
        <v-expansion-panel
            title="Groups"
            text="">
                <v-expansion-panel-text>
                <v-text-field
                    class=""
                    v-model="searchQuery"
                    clearable
                    append-inner-icon="mdi-magnify"
                    hide-details="auto"
                    label="Search"
                ></v-text-field>
                <div v-for="group in groups" :key="group.id" >
                <v-card class="my-3">
                    <template v-slot:title >
                        <div class="groupClassTitle">
                            <!-- <img src="@/assets/marker.svg" alt="marker"> -->
                            <p>{{ group.name }}</p>
                            <v-icon class="ml-10"
                            @click="showLights = !showLights"
                            > mdi-chevron-down</v-icon>
                        </div>
                    </template>

                    <!-- <v-card-text>
                    This is content
                    </v-card-text> -->
                </v-card>
                  <v-card v-if="showLights" v-for="light in group.lights"
                  :title="light"
                  class="lights">

                  </v-card>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</v-row>

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

const searchQuery = ""
const showLights = ref(false)
const groups = [{id: 0, name: 'skupina 1', lights: ['x', 'y']}, {id: 1, name: 'skupina 2', lights: ['z', 'e']}]

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
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0);
  }
}

.background-image {
  background-image: url("../assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.groupClassTitle {
    display: flex;
    align-items: center;
}

.groupClassTitle p {
    margin-left: 15px;
}

.lights {
  margin-left: 20px;
  animation: all 0.5s;
  color: red

}

.lights:nth-child(2){
  animation-duration: 500ms;
  color: blue;
}

.lights:nth-child(3){
  animation-duration: 1000ms;
  color: blue;
}

</style>
``