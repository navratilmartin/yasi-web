<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import AppBar from '@/components/AppBar.vue'
import Footer from '@/components/Footer.vue';

type MenuItem = {
  year: string;
  title: string;
  text: string
  thumbnail: string;
  videoUrl: string;
  icon: string;
  color: string;
};

const items = ref<MenuItem[]>([
    { year: "2011", title: 'V roce 2011 jsme se poprvé bavili', text: '', thumbnail: '/assets/young.jpg', videoUrl: 'https://www.youtube.com/embed/-ty6MkKT13c', icon: 'mdi-account-circle', color: 'primary' },
    { year: "2014", title: 'Skrze hudbu poznáš člověka...', text: '', thumbnail: '/assets/mesic.jpeg', videoUrl: 'https://www.youtube.com/embed/WBbEEmF6hhM', icon: 'mdi-account-cowboy-hat', color: 'primary' },
    { year: "2017", title: 'Postupně jsme si byli blíž a blíž', text: '', thumbnail: '/assets/koupelna.jpeg', videoUrl: 'https://www.youtube.com/embed/2FnIi3IszEM', icon: 'mdi-account-heart', color: 'primary' },
    { year: "2019", title: 'Až se z nás stali nejlepší kamarádi', text: '', thumbnail: '/assets/praha.jpeg', videoUrl: 'https://www.youtube.com/embed/8es5Y5ETNlU', icon: 'mdi-all-inclusive', color: 'primary' },
    { year: "2020", title: 'A později i víc než kamarádi... 💖28. 12.💖', text: '', thumbnail: '/assets/love.jpeg', videoUrl: 'https://www.youtube.com/embed/TCVif2qj0lc', icon: 'mdi-heart', color: 'primary' },
    { year: "2021", title: 'Egypt - Naše první traveling experience', text: '', thumbnail: '/assets/egypt.jpeg', videoUrl: 'https://www.youtube.com/embed/QeY_4iimrTI', icon: 'mdi-mosque', color: 'primary' },
    { year: "2022", title: 'Začátek tvojí Tiktok kariéry', text: '', thumbnail: '/assets/tiktok1.jpeg', videoUrl: 'https://www.youtube.com/embed/fmCFZRfvca4', icon: 'mdi-cellphone', color: 'primary' },
    { year: "2023", title: 'Thajsko - náš nejdelší a nejlepší výlet✈️', text: '', thumbnail: '/assets/slon1.jpeg', videoUrl: 'https://www.youtube.com/embed/Vjex-pZXa4U', icon: 'mdi-plane-car', color: 'primary' },
    { year: "?", title: '...', text: '', thumbnail: '/assets/face.jpeg', videoUrl: 'https://www.youtube.com/embed/fmCFZRfvca4', icon: 'mdi-road', color: 'primary' },
    ]);

const dialog = ref(false);
const selectedItem = ref<MenuItem>();

const showDialog = (item: MenuItem) => {
  selectedItem.value = item;
  dialog.value = true;
};

onMounted(() => {
    // 
  setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => item.classList.remove('active'));
      document.getElementById('route')?.classList.add('active');
  }, 1)
})
</script>
<template>
    <body style="height: 100%" class="pb-16">
        <AppBar/>
        <v-timeline
        style="margin-top: 100px; padding-bottom: 100px;"
        line-thickness="3"
        line-color="#e8d9e3"
        truncate-line="start"
        >
            <v-timeline-item
            v-for="(item, index) in items"
            :key="index"
            :icon="item.icon"
            class="pa-6"
            :dot-color="item.color"
            fill-dot
            size="large"
            >
            <template v-slot:opposite>
                <div
                :class="`pt-1 headline font-weight-bold text-${item.color}`"
                v-text="item.year"
                ></div>
            </template>

            <v-card color="#e8d9e3" width="400px">
                <v-card-title  :class="`bg-${item.color}`" class="d-flex justify-center">{{ item.title }}</v-card-title>
                <v-card-text class="ma-3">{{ item.text }}</v-card-text>
                <div class="d-flex justify-center">
                    <v-avatar size="250px" class="mb-6">
                        <v-img :src="item.thumbnail" class="video-thumbnail" @click="() => showDialog(item)"></v-img>
                    </v-avatar>
                </div>
            </v-card>

            </v-timeline-item>
        </v-timeline>
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
            <iframe 
                :src="selectedItem?.videoUrl" 
                width="800" 
                height="450" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
            </v-card>
        </v-dialog>
    </body>
    <Footer/>
</template>
<style>

.v-card-title {
    font-size: 18px !important;
}

.v-timeline-item__opposite {
  max-width: fit-content;
}

.v-timeline-item__body {
    margin-bottom: 20px;
}

.video-thumbnail {
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  scale: 1.36
}

.video-thumbnail:hover {
  transform: scale(1.1);
}
</style>