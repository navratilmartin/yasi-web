<script lang="ts" setup>
import { computed, ref, watch, reactive} from 'vue'
import draggable from 'vuedraggable'
import DisplayGroup from '@/components/DisplayLights.vue'

    interface Light {
        id: string
    }

    interface Group {
        id: string
        name: string
        color: string
        lights: Light[]
    }

    const groupColors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Grey', 'Black']
    const unassignedLights = ref<Light[]>([{id: 'svetlo1'}, {id: 'svetlo2'}, {id: 'svetlo3'}, {id: 'svetlo4'}, {id: 'svetlo5'}, {id: 'svetlo6'}, {id: 'svetlo7'}, {id: 'svetlo8'}, {id: 'svetlo9'}])
    const props = defineProps<{
        groups: Group[]
    }>()

    const searchQuery = ref('')
    const groups = ref<Group[]>([{id: '0', name: 'Skupina 1', color: 'red', lights: [{id: 'l1'}, {id: 'l2'}, {id: 'l3'}]},
      {id: '1', name: 'Skupina 2', color: 'red', lights: [{id: 'l4'}, {id: 'l5'}, {id: 'l6'}]}, 
      {id: '2', name: 'Skupina 3', color: 'red', lights: [{id: 'l7'}, {id: 'l8'}, {id: 'l9'}]}])
    const openPanels = ref<string[]>([])

    const groupDialog = ref(false)

    const groupFormVariables = reactive({
        id: '',
        name: '',
        color: '',
        lights: <Light[]>[]
    })
    const editing = ref(false)
    const editingGroupId = ref('')
    
    const filteredGroups = computed(() => {
        const searchQueryLower = searchQuery.value.toLowerCase()
        const isGroupId = (group: Group) => {return group.name.toLowerCase().includes(searchQueryLower)}
        const isLightId = (group: Group) => {return group.lights.some(light => light.id.toLowerCase().includes(searchQueryLower))}
        return groups.value.filter(group => isGroupId(group) || isLightId(group))
    })

    watch(filteredGroups, (newFilteredGroups) => {
        openPanels.value = []
        openPanels.value.push(newFilteredGroups.find(group => 
        group.lights.some(light => light.id.toLowerCase() === searchQuery.value.toLowerCase()))?.name || '')
    })

    const addGroup = () => {
        groupFormVariables.id = Math.random().toString()
        groupFormVariables.name = ''
        groupFormVariables.color = ''
        groupFormVariables.lights = []
        editing.value = false
    }

    const editGroup = (group: Group) => {
        editingGroupId.value = group.id
        editing.value = true
        groupDialog.value = true
        groupFormVariables.id = group.id
        groupFormVariables.name = group.name
        groupFormVariables.color = group.color
        groupFormVariables.lights = group.lights
    }

    const saveCreatedGroup = () => {
        groups.value.push({id: groupFormVariables.id, name: groupFormVariables.name, color: groupFormVariables.color, lights: groupFormVariables.lights})
        groupDialog.value = false
        editing.value = false
    }

    const saveEditedGroup = () => {
        const groupIndex = groups.value.findIndex(group => group.id === editingGroupId.value)
        groups.value[groupIndex] = {id: groupFormVariables.id, name: groupFormVariables.name, color: groupFormVariables.color, lights: groupFormVariables.lights}
        groupDialog.value = false
        editing.value = false
    }

    const draggedElement = ref<Light>({id: ''})
    const originalGroup = ref<Group>({id: '', name: '', color: '', lights: []})

    const startDragLightsWithGroup = (e: any) => {
        originalGroup.value = groups.value.find(group => group.lights.some(light => light.id === e.target.textContent)) || {id: '', name: '', color: '', lights: []}
        groups.value.forEach(group => group.lights.find(light => {
            if(light.id === e.target.textContent){
            draggedElement.value = light
            return}
        }))
        console.log(originalGroup.value)
        console.log(draggedElement.value)
    }

    const startDragunassignedLights = (e: any) => {
        draggedElement.value = unassignedLights.value.find(light => light.id === e.target.textContent) || {id: ''}
        originalGroup.value = {id: '', name: '', color: '', lights: []}
        console.log(originalGroup.value)
        console.log(draggedElement.value)
    }

    const allowDrop = (e: any) => {
        e.preventDefault()
    }

    const dropItemIntoGroup = (e: any) =>  {
        if(originalGroup.value.name !== e.target.parentElement.textContent){
            const wantedGroup = groups.value.find(group => group.name === e.target.parentElement.textContent)
            // unshift funguje krasne podle zadani (davat lights dropnuty na skupinu na zacatek pole), ale mozna se na to vysrat a pushovat je na konec?
            wantedGroup?.lights.unshift(draggedElement.value)
            console.log(originalGroup.value)
            console.log(draggedElement.value)
            // If originalGroup.value.name === '', then the dragged light is from unassignedLights array
            if(originalGroup.value.name === ''){
                unassignedLights.value.splice(unassignedLights.value.findIndex(light => light.id === draggedElement.value.id), 1)
            }
            else{
                console.log(originalGroup.value.lights.findIndex(light => light.id === draggedElement.value.id))
                originalGroup.value.lights.splice(originalGroup.value.lights.findIndex(light => light.id === draggedElement.value.id), 1)
            }
        }
    }

    const dialogSelectedLights = ref<Light[]>([])

    const updateDialogSelectedLights =  (selectedLights: Light[]) => {
        dialogSelectedLights.value = selectedLights
    }

    const hideAssigned = ref(false)

    // TODO
    // Drag and drop transitions
</script>

<template>
    <v-row>
        <v-col cols="12" md="8">

        </v-col>
        <v-col cols="12" md="4">
    <p> {{ dialogSelectedLights }} </p>

        <v-card style="background-color:#e4e4e4" class="">
            <div class="d-flex justify-self-center mx-4 mt-3">
                <h2 class="ml-2">Groups</h2>
                <v-btn
                    color="primary"
                    class="ml-auto mr-2"
                    @click="addGroup()">
                        Add group
                        <v-dialog
                            v-model="groupDialog"
                            activator="parent"
                            max-width="1500px"
                        >
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ editing ? 'Edit group' : 'Create group' }}</span>
                                </v-card-title>
                                <v-card-text>
                                        <v-row class="mx-5">
                                            <v-col cols="12" md="4">
                                                <v-text-field
                                                    v-model="groupFormVariables.name"
                                                    label="Group name"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-select
                                                    v-model="groupFormVariables.color"
                                                    label="Group color"
                                                    :items="groupColors"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row class="mx-5">
                                            <v-col cols="12" md="9" class="d-flex align-center justify-center">
                                                <p>mapa</p>
                                            </v-col>
                                            <v-col cols="12" md="3">
                                                <v-sheet
                                                class="d-flex flex-column flex-wrap justify-center px-11 pb-11 pt-7 rounded-lg" 
                                                color="grey-lighten-3">
                                                <h2 class="mx-auto">Streetlights</h2>
                                                <DisplayGroup title="Unassigned" :lights="unassignedLights" :selected-lights="dialogSelectedLights" @updateSelectedLights="updateDialogSelectedLights"/>
                                                <div class="animateHideAssigned" v-if=hideAssigned>
                                                    <DisplayGroup v-for="group in groups" :key="group.id" 
                                                    :title="group.name" 
                                                    :lights="group.lights" 
                                                    :selected-lights="dialogSelectedLights"
                                                    @updateSelectedLights="updateDialogSelectedLights"/>
                                                </div>
                                                <v-row class="d-flex align-center ma-0">
                                                    <v-col cols="1" class="pl-2 progressCursor" >
                                                        <v-divider class="border-opacity-100 " style="width:15px" color="primary"></v-divider>
                                                    </v-col>
                                                    <v-col cols="8" class="pa-0 pl-3 progressCursor">
                                                        <p class="text-primary"  @click="hideAssigned=!hideAssigned">Hide assigned</p>
                                                    </v-col>
                                                </v-row>
                                            </v-sheet>
                                            </v-col>
                                        </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" block @click="editing ? saveEditedGroup() : saveCreatedGroup()">
                                        {{ editing ? 'Save' : 'Create' }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-btn>
                </div>
            <v-card-text>
                <v-text-field
                    variant="outlined"
                    v-model="searchQuery"
                    append-inner-icon="mdi-magnify"
                    hide-details="auto"
                    label="Search"
                    
                ></v-text-field>
                <v-expansion-panels
                v-model="openPanels">
                    <v-expansion-panel v-for="group in filteredGroups" :key="group.id" :value="group.name"
                        class="my-2"
                        @dragover="allowDrop"
                        @drop="dropItemIntoGroup">
                        <template #title>
                            <div class= "d-flex align-center flex-grow-1">
                                <!-- <img src="@/assets/marker.svg" alt="marker" height="50"> -->
                                <p class="ml-6">{{ group.name }}</p>
                                <v-icon icon="mdi-pen" class="ml-auto mr-2 onHoverIcon" @click.stop="editGroup(group)"/>
                            </div>
                        </template>
                        <template #text>
                    <div class="pt-3 px-6 pb-4" @drop.stop>
                        <draggable :list="group.lights" 
                        class="list-group" 
                        item-key="id"
                        @dragstart="startDragLightsWithGroup" 
                        group="lights">
                            <template #item="{element: light}">
                            <v-card :key="light.id"
                            :class="{ 'selected-card': light.id.toLowerCase() === searchQuery.toLowerCase(), 'list-group-item': true}"
                            variant="outlined" 
                            style="background-color: white; margin-bottom: 12px;"
                            @drop.stop>
                                <v-card-title class="d-flex">
                                    <!-- <img src="@/assets/marker.svg" 
                                    alt="marker"
                                    height="30"> -->
                                    <p class="ml-4">{{ light.id }}</p>
                                    <v-icon icon="mdi-pen" class="ml-auto mr-2"/>
                                </v-card-title>
                            </v-card>
                            </template>
                        </draggable>
                            </div>
                        </template>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="justify-space-evenly" style="min-height: 80px;">
                    <draggable :list="unassignedLights" class="list-group" @dragstart="startDragunassignedLights" group="lights" item-key="id">
                        <template #item="{element: light}">
                    <v-card :key="light.id"
                        class="d-flex align-center justify-center ma-1 y" width="30%">
                        <p>{{ light.id }}</p>
                    </v-card>
                    </template>
                    </draggable>
                </div>
            </v-card-text>
        </v-card>
    </v-col>
    </v-row>
</template>

<style> 

.v-expansion-panel-title{
    padding: 10px 20px 10px 15px;
    font-size: 1.3rem;
}

.v-expansion-panel {
    border-radius: 7px;

}

.v-expansion-panel-title__overlay {
    background-color: white;
    border-radius: 10px;
}

.v-expansion-panel-text__wrapper {
    background-color: #e4e4e4;
    padding: 0 !important;
}

.v-card {
    z-index: initial;
}

.v-expansion-panels {
    z-index: initial;
}

.selected-card {
    border: 1px solid red;
    /* transform: scale(1.02);
    transition: transform 0.3s ease; */
}

/* .v-card:not(.selected-card){
    transition: transform 0.3s ease; 
}  */

.elevation-2 {      /* remove box-shadow at the add group button inside the modal*/
    box-shadow: none !important;
}

.onHoverIcon {
    z-index: 1;
    justify-self:flex-start;
}

.onHoverIcon:hover{
    transform: scale(1.1);
    transition: transform 0.5s ease;
    color: #1e33f2;
}

.onHoverIcon:not(:hover){
    transition: transform 0.5s ease;
    color: black;
}

.progressCursor:hover {
    cursor: pointer;
}

.animateHideAssigned {
    animation: all 0.5s ease-in-out;
}

@keyframes all {
  0% {
    opacity: 0;
    filter: blur(5px);
    transform: translateX(-20%);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateX(0);
  }
}
</style>