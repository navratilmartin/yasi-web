<template>
  <v-app>
    <v-btn v-if="isAuthenticated" color="error" class="ma-2 logout" @click="handleSignOut">Odhlásit</v-btn>
    <v-alert v-if="authError" type="error" class="mt-2">{{ authError }}</v-alert>

    <router-view />
    <v-footer color="primary" app>
      <span class="white--text">&copy; {{ date }} Birthday Celebration 🎁</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { signOutUser } from '@/services/firebase/firebaseAuthService';
import { useRouter } from 'vue-router';

const router = useRouter(); // Declare the router instance here
const authError = ref('');
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');

const handleSignOut = async () => {
  try {
    await signOutUser();
    router.push({ name: 'Login' }); // Replace 'Home' with the name of your home route
  } catch (error: any) {
    authError.value = error.message;
  }
};

const date = ref<string>(
    `${new Date().getFullYear()} -- ${new Date().getHours()}:${new Date().getMinutes()} 🥳`
);
  import DefaultView from './View.vue'
</script>
<style>
.logout {
  position: absolute;
  top: 10 ;
  right: 0;
}
</style>
