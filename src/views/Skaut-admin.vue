<template>
    <!-- <v-btn @click="deleteUsers()"> -->
        <!-- </v-btn> -->

    <div>
      <v-btn @click="fetchUsers">Load Users</v-btn>
      <ul>
        <li v-for="user in users" :key="user.id">
            {{ user.name }} - {{ user.email }} - {{ user.firstOption }} - {{ user.secondOption }} - {{ user.thirdOption }}
            <v-btn @click="deleteUser(user.id)">Delete user</v-btn>
        </li>   
    </ul>
    <p> {{ votingResultsMap }}</p>
</div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watchEffect } from 'vue';
  import { useMapStore } from '@/store/MapStore'

  const mapStore = useMapStore()
  
  type User = {
    id: number;
    name: string;
    email: string;
    firstOption: string,
    secondOption: string,
    thirdOption: string,
  };

  const radioGroupsValues = ref([
    {value: 0},
    {value: 0},
    {value: 0}
  ])
  const radioGroupOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const name = ref('');
  const email = ref('');
  const users = ref<User[]>([]);

  const nameErrorMessage = computed(() => {
    if (name.value.length <= 2) {
      return 'Jmeno musi byt delsi nez 2 znaky';
    }
    return '';
  })
  const emailErrorMessage = computed(() => {
    if (!email.value.includes('@')) {
      return 'Email musi byt valid';
    }
    return '';
  
  })

  const isFormValid = computed(() => {
    return email.value.includes('@') && name.value.length > 2;
  })

  const votingResultsMap = ref(new Map<string, number>());
  watchEffect(() => {
    if(!users) return
    votingResultsMap.value = new Map<string, number>();
    users.value.forEach(user => {
        votingResultsMap.value.set(user.firstOption, (votingResultsMap.value.get(user.firstOption) || 0) + 3);
        votingResultsMap.value.set(user.secondOption, (votingResultsMap.value.get(user.secondOption) || 0) + 2);
        votingResultsMap.value.set(user.thirdOption, (votingResultsMap.value.get(user.thirdOption) || 0) + 1);
    })
    const sortedMap: Map<string, number> = new Map([...votingResultsMap.value.entries()].sort((a, b) => b[1] - a[1]));
    votingResultsMap.value = sortedMap;
    mapStore.updateMap(votingResultsMap.value)
    console.log(mapStore.mapa)
  })

  const submit = () => {
    console.log('submited', radioGroupsValues.value);
    addUser();
  }
  
  const addUser = async () => {
    const userData = {
      name: name.value,
      email: email.value,
      firstOption: radioGroupsValues.value[0].value,
      secondOption: radioGroupsValues.value[1].value,
      thirdOption: radioGroupsValues.value[2].value,
    };

    try {
      const response = await fetch('http://localhost:5000/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok', await response.json());
      }
  
      const result = await response.json();
      console.log(result);
      fetchUsers(); 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      users.value = result.users;
    } catch (error) {
      console.error('There was a problem fetching users:', error);
    }
  };

  const deleteUser = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:5000/delete-user/${userId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log(result);
    fetchUsers();
  } catch (error) {
    console.error('There was a problem with the delete operation:', error);
  }
};
  onMounted(fetchUsers);
  </script>