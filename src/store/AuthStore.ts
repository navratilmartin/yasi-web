import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
    const user = ref()

    const loginUser = (newUser: any) => {
        user.value = newUser
    }

    const logoutUser = () => {
        user.value = undefined
    }


    return {
        user,
        loginUser,
        logoutUser,
    }
})