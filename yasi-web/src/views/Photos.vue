<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AppBar from '@/components/AppBar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';

const clientId = '713102507327-bs9746cuoa8n309kfgsemfaeb3i65cu0.apps.googleusercontent.com'; // Replace with your client ID
const redirectUri = 'http://localhost:3000'; // Replace with your redirect URI
const scope = 'https://www.googleapis.com/auth/photoslibrary.readonly'; // Scope for Google Photos

const isLoadingNextPage = ref(false);

const accessToken = ref(null);
const albums = ref<any>([]);
const selectedAlbum = ref();
const photos = ref<any>([]);

const nextPageToken = ref(null);

const fetchAlbums = async () => {
  if (!accessToken.value) return;
  try {
    const response = await axios.get('https://photoslibrary.googleapis.com/v1/albums', {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });
    albums.value = response.data.albums; // Array of album objects
    console.log('albums fetched', albums.value)
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
};

watch(selectedAlbum , () => {
  console.log('watch triggered')
  if (selectedAlbum.value) {
    photos.value = [];
    nextPageToken.value = null;
    fetchPhotosFromAlbum();
  }
})

const fetchPhotosFromAlbum = async () => {
  if (!selectedAlbum.value) return;
  isLoadingNextPage.value = true; // Stop loading
  try {
    const response = await axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
      albumId: selectedAlbum.value.id,
      pageToken: nextPageToken.value,
    }, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });
    photos.value.push(...response.data.mediaItems); // Append new photos
    nextPageToken.value = response.data.nextPageToken; // Update the next page token
  } catch (error) {
    console.error('Error fetching photos from album:', error);
  } finally {
    isLoadingNextPage.value = false; // Stop loading
  }
};

const startOAuth = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
  window.location.href = authUrl;
};

const exchangeCodeForToken = async (code:string) => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: clientId,
      client_secret: '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',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    accessToken.value = response.data.access_token;
    // Optionally, store the access token in localStorage or Vuex for further use
    return accessToken.value;
  } catch (error) {
    console.error('Error during token exchange:', error);
    return null;
  }
};

const handleAuthentication = async (code:string | null) => {
  if(code === null) return
  const token = await exchangeCodeForToken(code);
  if (token) {
    await fetchAlbums();
  } else {
    console.error('Failed to authenticate');
  }
};

const handleScroll = () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (nearBottom && nextPageToken.value) {
    fetchPhotosFromAlbum();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  setTimeout(() => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    document.getElementById('photos')?.classList.add('active');
  }, 1);

  const code = localStorage.getItem('code')
  console.log('code2', code)

  handleAuthentication(code)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <body style="height: 100%">
<AppBar/>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="startOAuth">Načti fotky</v-btn>
        <v-select
          label="Select Album"
          v-model="selectedAlbum"
          :items="albums"
          item-text="title"
          item-value="id"
          return-object
        ></v-select>
      </v-col>
    </v-row>

    <!-- Grid layout for photos -->
    <v-row>
      <v-col
        v-for="photo in photos"
        :key="photo.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <img :src="photo.baseUrl" :alt="photo.filename" class="photo-grid-item">
      </v-col>
    </v-row>
    <div class="loading-indicator">
      <v-progress-circular
      v-if="isLoadingNextPage"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
    <Footer/>
  </v-container>
</body>
</template>

<style>

.photo-grid-item {
  width: 100%;
  height: auto;
  object-fit: cover; /* Adjusts the image size to cover the area */
  border-radius: 5px; /* Optional: for rounded corners */
  margin-bottom: 15px; /* Space between photos */
}

.loading-indicator {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>