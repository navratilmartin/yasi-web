<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AppBar from '@/components/AppBar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';

const isMediaDialogOpen = ref(false);
const selectedMedia = ref();

const handleMediaClick = (mediaItem: any) => {
  selectedMedia.value = mediaItem;
  isMediaDialogOpen.value = true;
};

const isVideo = (mediaItem: any) => {
  return mediaItem.mediaMetadata.video !== undefined
};

const clientId = import.meta.env.VITE_CLIENT_ID
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scope = import.meta.env.VITE_SCOPE;
const client_secret = import.meta.env.VITE_CLIENT_SECRET

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

    // @ts-ignore
    albums.value = response.data.albums.map(album => ({
      ...album,
      thumbnailUrl: album.coverPhotoBaseUrl, 
    }));

  } catch (error) {
  }
};

watch(selectedAlbum , () => {
  if (selectedAlbum.value) {
    photos.value = [];
    nextPageToken.value = null;
    fetchPhotosFromAlbum();
  }
})

const fetchPhotosFromAlbum = async () => {
  if (!selectedAlbum.value) return;
  isLoadingNextPage.value = true;
  try {
    const response = await axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
      albumId: selectedAlbum.value.id,
      pageToken: nextPageToken.value,
      pageSize: 20,
    }, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });
    photos.value.push(...response.data.mediaItems); 
    nextPageToken.value = response.data.nextPageToken; 
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingNextPage.value = false; 
  }
};

const startOAuth = () => {
  if(!clientId || !redirectUri || !scope) {
    return
  }
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
  window.location.href = authUrl;
};

const exchangeCodeForToken = async (code:string) => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: clientId,
      client_secret: client_secret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    accessToken.value = response.data.access_token;
    return accessToken.value;
  } catch (error) {
    console.log(error)
  }
};

const handleAuthentication = async (code:string | null) => {
  if(code === null) return
  const token = await exchangeCodeForToken(code);
  if (token) {
    await fetchAlbums();
  }
};

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = 100;
  const totalHeight = document.documentElement.scrollHeight;

  const nearBottom = scrollPosition >= totalHeight - threshold;

  if (nearBottom && nextPageToken.value && !isLoadingNextPage.value) {
    fetchPhotosFromAlbum();
  }
};

const buttonPosition = ref('initial');

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  setTimeout(() => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    document.getElementById('photos')?.classList.add('active');
  }, 1);

  setTimeout(() => {
    buttonPosition.value = 'moved';
  }, 300);

  const code = localStorage.getItem('code')

  handleAuthentication(code)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <body style="height: 100%">
<AppBar/>
  <v-container class="px-16" style="margin-top: 90px">
    <v-row>
      <v-col cols="12">
        <v-btn :class="{'initial-position': buttonPosition === 'initial', 'moved-position': buttonPosition === 'moved'}" 
        color="primary"
        @click="startOAuth">
        Načti fotky
      </v-btn>
      </v-col>
    </v-row>

    <!-- Grid layout for albums -->
    <v-row v-if="albums.length > 0">
      <v-col
        v-for="album in albums"
        :key="album.id"
        cols="12" sm="6" md="4" lg="3"
        class="px-5"
      >
        <v-card>
          <v-img
            :src="album.thumbnailUrl"
            height="fit-content"
            class="d-flex align-end"
            style="cursor: pointer;"
            @click="selectedAlbum = album"
          >
          <v-card-title class="overlay-title">
            {{ album.title }}
          </v-card-title>
       </v-img>
        </v-card>
      </v-col>
      <v-divider thickness="5" class="my-8" color="primary"></v-divider>
    </v-row>

    <!-- Grid layout for photos -->
    <v-row>
      <v-col
        v-for="photo in photos"
        :key="photo.id"
        @click="handleMediaClick(photo)"
        cols="12" sm="6" md="4" lg="3"
        class="px-5"
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
  <v-dialog v-model="isMediaDialogOpen" width="fit-content" max-width="800px">
    <template v-slot:default="dialog">
      <v-card>
        <!-- Check if the selected media is a video -->
        <template v-if="isVideo(selectedMedia)">
          <video controls :src="selectedMedia.baseUrl + '=dv'" style="width: 100%; height: 80vh;"></video>
        </template>
        <template v-else>
          <img :src="selectedMedia.baseUrl" alt="Selected Media" style="width: 100%;" />
        </template>
      </v-card>
    </template>
  </v-dialog>
    <Footer/>
  </v-container>
</body>
</template>

<style>
.overlay-title {
  background-color: rgba(0, 0, 0, 0.5);
  color: white; 
  width: 100%;
  padding: 8px;
}

.photo-grid-item {
  width: 100%;
  height: 53vh;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
  transition: all 0.3s ease-in-out;
}

.photo-grid-item:hover {
  cursor: pointer;
  transform: scale(1.03);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 50px;
}

.initial-position {
  position: absolute;
  top: 40px;
  right: 195px;
  transition: top 0.6s ease-in-out;
}

.moved-position {
  position: absolute;
  top: 75px;
  right: 195px;
  transition: top 0.6s ease-in-out;
}

</style>