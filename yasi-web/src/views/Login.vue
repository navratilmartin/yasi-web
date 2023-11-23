<script setup lang="ts">
import { useAuthState } from '@/composables/useAuthState';

const { currentUser } = useAuthState();
</script>

<template>
  <div>
    <p v-if="currentUser">User is logged in</p>
    <p v-else>User is not logged in</p>
    <p>{{ currentUser }}</p>
  </div>
</template>