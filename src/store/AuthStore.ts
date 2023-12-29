import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
    const user = ref()

    watchEffect(() => {
        console.log('userChangedInAuthStore', user.value)
    })

    const loginUser = (newUser: any) => {
        user.value = newUser
        console.log('pica', user.value)
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