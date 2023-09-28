<!-- TODO lights array scrollable -->
<!-- expansion panel border-radius doesnt work, looking ugly :( -->
<script lang="ts" setup>
import { computed, ref, watch, reactive} from 'vue'

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
    const unclassifiedLightsList = ref<Light[]>([{id: 'svetlo1'}, {id: 'svetlo2'}, {id: 'svetlo3'}, {id: 'svetlo4'}, {id: 'svetlo5'}, {id: 'svetlo6'}, {id: 'svetlo7'}, {id: 'svetlo8'}, {id: 'svetlo9'}])
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

    const deleteLightById = (id: string) => {
        groups.value.forEach(group => {
            const indexToDelete = group.lights.findIndex(light => light.id === id)
            if(indexToDelete !== -1){
                group.lights.splice(indexToDelete, 1)
            }
        })
    }

    let draggedLight: Light = {id: ''};
    let dragTarget: any = null;
    const groupCards = ref(document.getElementsByClassName('v-card-title'))

    const dragStart = (e: any) => {
        draggedLight.id = e.target.textContent

        // Passing dragTarget so i can remove it later
        dragTarget = e.target
    }

    const allowDrop = (e: any) => {
        e.preventDefault()
    }

    const dragDrop = (e: any) =>{
        console.log('x', e.clientX, 'y', e.clientY)
        // wantedGroup will fail if light IDs arent unique. Also if id of one light is included in another one (e.g. light1:light13)
        const wantedGroup = groups.value.find(group => group.lights.some(light => e.target.textContent.includes(light.id)))
        console.log('wantedGroupName', wantedGroup?.name)
        console.log('wgl', wantedGroup?.lights)
        console.log(e.target)
        console.log(dragTarget.parentElement)

        // If dragging and dropping in the same element
        if(e.target === dragTarget.parentElement){
            deleteLightById(draggedLight.id)
        }

        // Finding the index, which I want to insert the light behind
        Array.from(groupCards.value).forEach(x => console.log('cardsPosition',x.getBoundingClientRect().y))
        let indexToInsert: any = Array.from(groupCards.value).findIndex(htmlElemendCard => htmlElemendCard.getBoundingClientRect().y > e.clientY) 
        indexToInsert = indexToInsert === -1 ? wantedGroup?.lights.length : indexToInsert
        console.log('index', indexToInsert)

        // Inserting the dropped light into the existing groups array
        groups.value.find(group => group.name === wantedGroup?.name)?.lights.splice(indexToInsert, 0, draggedLight)

        // Finally deleting the dragged element from the original array and removing the dragged target
        unclassifiedLightsList.value.splice(unclassifiedLightsList.value.findIndex(light => light.id === draggedLight.id), 1)
        dragTarget.remove()
        draggedLight = {id: ''}
    }

    const dragDropUnclassify = (e: any) => {
        unclassifiedLightsList.value.push({id:  draggedLight.id})
        console.log(unclassifiedLightsList)
        console.log(e.target === dragTarget.parentElement)
        // if(e.target === dragTarget.parentElement){
        //     deleteLightById(draggedLight.id)
        // }
        deleteLightById(draggedLight.id)
        draggedLight = {id: ''}
        dragTarget.remove()
    }

    const getOffset = (e:any) => {
    //     Array.from(groupCards.value).forEach(x => console.log(x.getBoundingClientRect().y))
    //     console.log(e.target.textContent)
    //     hoveredLight = {id: e.target.textContent}
    //     console.log('hoveredlight',hoveredLight.id)
    //     console.log(e.target.getBoundingClientRect())
    //     onmousemove = function(e) {
    //     console.log('mouse position',e.clientX, e.clientY)
    // }
    }
    // TODO: pokud dropuju ve stejnym divu; ze skupin do unclassifiedLights - funkce deleteLightById; onhover na expansion panel, aby se otevrel; pretahovani lights do prazdne skupiny - vyhazuje error
</script>

<template>
    <v-row>
        <v-col cols="6">
        </v-col>
        <v-col cols="12" md="4">
                <v-btn
        color="primary"
        @click="addGroup()">
            Add group
            <v-dialog
                v-model="groupDialog"
                activator="parent"
                max-width="1000px"
            >
                <v-card>
                    <v-card-title>
                        <span class="text-h5">{{ editing ? 'Edit group' : 'Add group' }}</span>
                    </v-card-title>
                    <v-card-text>
                       <v-container>
                            <v-row>
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
                                <v-col cols="12" md="4">
                                    <v-select
                                    v-model="groupFormVariables.lights"
                                    label="Select lights"
                                    multiple
                                    item-title= "id"
                                    return-object
                                    :items=unclassifiedLightsList>

                                    </v-select>
                                </v-col>
                            </v-row>
                       </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block @click="editing ? saveEditedGroup() : saveCreatedGroup()">
                            {{ editing ? 'Save group' : 'Add group' }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>

        <v-card style="background-color:#e4e4e4" class="">
            <h2 class="mx-4 mt-2">Groups</h2>
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
                        class="my-2">
                        <template #title>
                            <div class= "d-flex align-center" style="flex-grow: 1;"  @dragover.stop>
                                <!-- <img src="@/assets/marker.svg" alt="marker" height="50"> -->
                                <p class="ml-6">{{ group.name }}</p>
                                <v-icon icon="mdi-pen" class="ml-auto mr-2 onHoverIcon" @click.stop="editGroup(group)"/>
                            </div>
                        </template>
                        <template #text class="">
                    <div
                    @dragstart="dragStart($event)"
                    @dragover="allowDrop($event)"
                    @drop="dragDrop($event)"
                    class="pt-3 px-6 pb-4">
                            <v-card v-for="light in group.lights" :key="light.id"
                            :class="{ 'selected-card': light.id.toLowerCase() === searchQuery.toLowerCase(), 'x': true }"
                            variant="outlined"
                            style="background-color: white; margin-bottom: 12px;"
                            draggable="true"
                            @drop.stop>
                                <v-card-title class="d-flex"
                                @mouseover="getOffset($event)">
                                    <!-- <img src="@/assets/marker.svg"  -->
                                    <!-- alt="marker"
                                    height="30"
                                    @mouseover.stop=""> -->
                                    <p class="ml-4" @mouseover.stop>{{ light.id }}</p>
                                    <v-icon icon="mdi-pen" class="ml-auto mr-2"/>
                                </v-card-title>
                            </v-card>
                            </div>
                        </template>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="d-flex justify-space-evenly"
                    @dragover="allowDrop($event)"
                    @drop="dragDropUnclassify($event)">
                    <v-card v-for="light in unclassifiedLightsList"
                        class="d-flex align-center justify-center ma-1 y" width="30%"
                        draggable="true"
                        @dragstart="dragStart($event)"
                        @dragover.stop>
                        {{ light.id }}
                    </v-card>
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

.x {
    color: blue;
    background-color: red;
}

.y {
    color: green;
    background-color: red;
    margin: 50px;
    border: 5px black solid;
}

</style>