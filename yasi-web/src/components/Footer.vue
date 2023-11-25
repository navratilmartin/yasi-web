<template>
    <v-footer class="mt-10" color="primary" app>
      <span class="white--text">&copy; {{ date }} Birthday Celebration 🎁</span>
    </v-footer>
</template>
<script lang="ts" setup>
import { ref} from 'vue';
const date = ref<string>(
    `${new Date().getFullYear()} -- ${new Date().getHours()}:${new Date().getMinutes()} 🥳`
);

</script>
<style>
</style>