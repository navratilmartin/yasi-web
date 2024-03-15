import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('mapStore', () => {
    const mapa = ref(new Map<string, number>())

    const updateMap = (data: Map<string, number>) => {
        mapa.value = data
    }

    const deleteMap = () => {
        mapa.value = new Map<string, number>()
    }

    return {
        mapa,
        updateMap,
        deleteMap,
    }
})