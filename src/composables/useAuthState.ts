// useAuthState.ts
import { ref, onUnmounted, watchEffect } from 'vue';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import "@/services/firebase/firebaseConfig"

const currentUser = ref<User | null>(null);

const auth = getAuth();

const unsubscribe = onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});

onUnmounted(() => {
  unsubscribe();
});

export function useAuthState() {
  return { currentUser };
}