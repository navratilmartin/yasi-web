<script lang="ts" setup>
import { onMounted } from 'vue';
import AppBar from '@/components/AppBar.vue'


onMounted(() => {
    // 
  setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => item.classList.remove('active'));
      document.getElementById('photos')?.classList.add('active');
  }, 1)
})
</script>
<template>
<AppBar/>
Photos
  <v-container>
    <v-row>
      <!-- <v-col cols="12" md="6" lg="4" v-for="photo in photos" :key="photo.id">
        <v-card>
          <v-img :src="photo.url" :alt="photo.title"></v-img>
          <v-card-title>{{ photo.title }}</v-card-title>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>
<style>

</style>