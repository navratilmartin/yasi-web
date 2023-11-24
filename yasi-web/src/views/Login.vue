<script setup lang="ts">
import { ref } from 'vue';
import { useAuthState } from '@/composables/useAuthState';
import { useAuthStore } from '@/store/AuthStore'
import { signIn, signUp, signOutUser } from '../services/firebase/firebaseAuthService';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const { currentUser } = useAuthState();
watchEffect(() => {
  console.log('login.vue',currentUser.value)
})

const userEmail = ref('');
const userPassword = ref('');
const authError = ref('');
const user = ref();

const authStore = useAuthStore();
const router = useRouter(); // Declare the router instance here

console.log('store', authStore.loginUser)

const handleLogin = async () => {
  try {
    user.value = await signIn(userEmail.value, userPassword.value);
    authStore.loginUser(user.value)
    console.log('authStoreUser', user.value)
    console.log(user.value.type, user.value)
    router.push({ name: 'Home' }); // Replace 'Home' with the name of your home route

    // Handle successful login
    // You may want to redirect or update the UI accordingly
  } catch (error: any) {
    authError.value = error.message;
  }
};

const handleSignUp = async () => {
  try {
    user.value = await signUp(userEmail.value, userPassword.value);
    console.log(user.value)
    // Handle successful sign up
  } catch (error: any) {
    authError.value = error.message;
  }
};

const handleSignOut = async () => {
  try {
    await signOutUser();
    // Handle successful sign out
  } catch (error: any) {
    authError.value = error.message;
  }
};

</script>

<template>
  <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="userEmail"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="userPassword"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-btn color="primary" class="ma-2" @click="handleLogin">Sign In</v-btn>
          <v-btn color="secondary" class="ma-2" @click="handleSignUp">Sign Up</v-btn>
          <v-btn color="error" class="ma-2" @click="handleSignOut">Sign Out</v-btn>

          <v-alert v-if="authError" type="error" class="mt-2">{{ authError }}</v-alert>
        </v-col>
      </v-row>
    </v-container>
    <v-btn @click="router.push({ name: 'Home' })">x</v-btn>
  <div>
    <p v-if="currentUser">User is logged in</p>
    <p v-else>User is not logged in</p>
    <p>{{ currentUser }}</p>
  </div>
</template>