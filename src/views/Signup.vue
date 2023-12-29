<template>
  <AppBar/>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <h1>Sign Up</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="userEmail"
            label="Email"
            type="email"
            required
          ></v-text-field>

          <v-text-field
            v-model="userPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            label="Password"
            required
          ></v-text-field>

          <v-btn color="primary" class="ma-2" @click="handleSignUp" :disabled="!valid">
            Sign Up
          </v-btn>

        </v-form>

        <v-alert v-if="authError" type="error" class="mt-2">{{ authError }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script setup lang="ts">
  import { ref} from 'vue';
  import { signUp } from '../services/firebase/firebaseAuthService';
  import { useRouter } from 'vue-router';
  import AppBar from '@/components/AppBar.vue'
  
  const router = useRouter(); 

  const userEmail = ref('');
  const userPassword = ref('');
  const showPassword = ref(false);
  const authError = ref('');
  const valid = ref(false);

  const user = ref();

  
  const handleSignUp = async () => {
  try {
    user.value = await signUp(userEmail.value, userPassword.value);
    router.push({ name: 'Home' });

  } catch (error: any) {
    authError.value = error.message;
  }
};

  </script>
  <style lang="scss">
  $items: 4;
  $width: 1 / $items;
  
  $colors: #ed254e, #10c15c, #91c4f2, #9d79bc;
  </style>