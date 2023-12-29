<script setup lang="ts">
import { ref } from 'vue';
import { useAuthState } from '@/composables/useAuthState';
import { signIn} from '../services/firebase/firebaseAuthService';
import { useRouter } from 'vue-router';

const { currentUser } = useAuthState();

const userEmail = ref('');
const userPassword = ref('');
const authError = ref('');
const loading = ref(false); 
const isDialogVisible = ref(false); 

const router = useRouter(); 

const handleLogin = async () => {
  loading.value = true;
  isDialogVisible.value = true; 
  try {
    await signIn(userEmail.value, userPassword.value);
    router.push({ name: 'Home' });
  } catch (error: any) {
    authError.value = error.message;
  } finally {
    loading.value = false;
    isDialogVisible.value = false;
  }
};
</script>

<template>
  <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="3" sm="6" md="4">
          <h1 class="mb-2 mt-16">Přihlášení</h1>
          <form @submit.prevent="handleLogin">
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

            <v-btn width="150" color="primary" class="ml-4" type="submit">Přihlásit</v-btn> <!-- Add type="submit" here -->
            <v-alert v-if="authError" type="error" class="mt-2">{{ authError }}</v-alert>
          </form>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="isDialogVisible" persistent max-width="300">
      <v-card>
        <v-card-text class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
          <div>Přihlašuji...</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  <!-- <div>
    <p v-if="currentUser">User is logged in</p>
    <p v-else>User is not logged in</p>
    <p>{{ currentUser }}</p>
  </div> -->
</template>