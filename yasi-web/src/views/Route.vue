<script lang="ts" setup>
import { onMounted } from 'vue';
import AppBar from '@/components/AppBar.vue'
import Footer from '@/components/Footer.vue';

onMounted(() => {
    // 
  setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => item.classList.remove('active'));
      document.getElementById('route')?.classList.add('active');
  }, 1)
})
</script>
<template>
    <body>
        route
        <AppBar/>
    </body>
    <Footer/>
</template>
<style>

</style>