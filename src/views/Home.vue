<template>
  <v-app>
    <section class="">
      <div id="fill" style="height: 100vh;"></div>
      <div v-for="photo in photoList" :key=photo.value class="slide"
      :class="{activeSlide: photo.value === selectedPhoto}">
        <img 
        :src="photo.value" 
        alt="profile" >
      </div>
      <AppBar/>
    </section>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <div>
              <img id='img' src="">
            </div>
            
            <v-card class="pa-5 mt-5 mx-16">
              <v-card-title class="text-h5">
                Všechno nejlepší, Yasinko! 💖
              </v-card-title>
              <v-card-text>
                <p>Všechno nejlepší tomu nejúžasnějšímu člověku, který kdy existoval. 🎉</p>
                <p>Jsi neskutečně vtipná, chytrá, krásná, hodná, užásná osoba, kterou budu vždycky milovat. 🙈</p>
                <p>Zasloužíš si jenom to nejlepší na světě, abys byla vždycky spokojená a nikdu smutná. 😍</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Buttons for sending emails -->
          <div class="d-flex justify-space-evenly my-4 px-16" >
            <v-btn color="primary" class="larger-button my-2" @click="() => startSendingEmail('comeOver')">Come Over</v-btn>
            <v-btn color="primary" class="larger-button my-2" @click="() => startSendingEmail('buyFood')">Buy yummi</v-btn>
            <v-btn color="primary" class="larger-button my-2" @click="() => startSendingEmail('call')">Call</v-btn>
            <v-btn color="primary" class="larger-button my-2" @click="() => startSendingEmail('<3')">💗</v-btn>
          </div>
        <v-dialog
          v-model="isDialogOpen"
          width="800px"
        >
          <v-card>
            <v-toolbar
              color="primary"
              class="pl-3"
              :title=dialogContent.title
            >
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-textarea v-model="dialogContent.message" label="Text zprávy"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="sendEmail(dialogContent.messageType, dialogContent.message)">Odešli zprávu</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="loading" persistent width="300">
          <v-card>
            <v-card-text class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div>Posílám email...</div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show">
          {{ snackbar.message }}
          <v-btn class="ml-1" :color="snackbar.succesful ? 'green' : 'red'" @click="snackbar.show = false">Zavřít</v-btn>
        </v-snackbar>
      </v-container>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, reactive, onMounted} from 'vue';
import emailjs from 'emailjs-com';
import { watchEffect } from 'vue';
import AppBar from '@/components/AppBar.vue';
import Footer from '@/components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 

const photoList = [
  {value: '/assets/zima-cut.jpeg'}, 
  {value: '/assets/old-cut.jpeg'},
  {value: '/assets/thajsko2.jpeg'},
  {value: '/assets/hokej.jpeg'},
  {value: '/assets/egypt-cut.jpeg'},
  {value: '/assets/zrce2.jpeg'},
  {value: '/assets/narozeniny-cut.jpeg'},
  {value: '/assets/thajsko1.jpg'},
  // {value: '/assets/italie-cut.jpeg'},
  {value: '/assets/egypt2.jpeg'},
  {value: '/assets/old_party.jpeg'},
  {value: '/assets/zrce.jpg'},
  {value: '/assets/svatba.jpg'},
  {value: '/assets/slon.jpeg'},
];

let index = Math.floor(Math.random() * photoList.length);
const selectedPhoto = ref(photoList[index].value);
const selectNextPhoto = () => {
  index = (index+1) % photoList.length;
  selectedPhoto.value = photoList[index].value;
}
const intervalId = setInterval(selectNextPhoto, 5000);

type MessageType = 'buyFood' | 'call' | 'comeOver' | '<3';
interface DialogContent {
    messageType: MessageType;
    message: string;
    title: string;
}
const isDialogOpen = ref(false);
const dialogContent = reactive<DialogContent>({
    messageType: '<3',
    message: '',
    title: '',
});
const closeDialog = () => {
  isDialogOpen.value = false;
  dialogContent.message = '';
  dialogContent.messageType = '<3';
}
watchEffect(() => {
  if(isDialogOpen.value === false){
    dialogContent.message = '';
    dialogContent.messageType = '<3';  }
})

const loading = ref(false);
const snackbar = ref({
  show: false,
  message: '',
  succesful: false,
});

const startSendingEmail = (messageType: MessageType) => {
  dialogContent.messageType = messageType;
  switch (messageType) {
    case 'buyFood':
      dialogContent.title = 'Koupit yummi';
      break;
    case 'call':
      dialogContent.title = 'Call';
      break;
    case 'comeOver':
      dialogContent.title = 'Come over';
      break;
    case '<3':
      dialogContent.title = '<3';
      break;
    default:
      dialogContent.title = '';
      break;
  }
  isDialogOpen.value = true;
}

const sendEmail = (messageType: MessageType, message: string) => {
  loading.value = true; 
  isDialogOpen.value = false;
  let messageTypeText = '';
  switch (messageType) {
    case 'buyFood':
      messageTypeText = 'abys jí koupil něco mnam';
      break;
    case 'call':
      messageTypeText = 'abys jí zavolal';
      break;
    case 'comeOver':
      messageTypeText = 'abys přijel';
      break;
    case '<3':
      messageTypeText = 'aby ses měl hezky';
      break;
    default:
      messageTypeText = 'default';
      break;
  }
  const templateParams = {
    to_name: 'Martine',
    from_name: 'Yasinky',
    message_type_text: messageTypeText,
    message: message,
  };

  emailjs.send('service_9b1mllp', 'template_frebc2d', templateParams, 'Z8UzH1aa-iMCUx0pi')
    .then((response) => {
      loading.value = false;
      snackbar.value = { show: true, message: 'Email byl v pořádku odeslán! 🎉', succesful: true };
    }, (error) => {
      loading.value = false;
      snackbar.value = { show: true, message: 'Email se nepodařilo odeslat. 😵', succesful: false };
    });
};

onMounted(() => {
  setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => item.classList.remove('active'));
      document.getElementById('home')?.classList.add('active');
  }, 1)
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    localStorage.setItem('code', code);
    router.push({ name: 'Photos' })
  }
})

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style lang="scss">

@keyframes slideToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1%);
  }
}

@keyframes slideBack {
  0% {
    transform: translateX(-1%); 
  }
  100% {
    transform: translateX(0);
  }

}

.slide {
  position: absolute;
  inset: 0; 
  opacity: 0;
  scale: 1.02;
  transition: 800ms opacity ease-in-out;
  transition-delay: 800ms;
  animation-delay: 1000ms;
  animation: slideBack 600ms ease-in-out forwards;
}

.activeSlide {
  opacity: 1;
  transition-delay: 0ms;
  scale: 1.02;
  animation-delay: 1600ms;
  animation: slideToLeft 5000ms linear forwards;
}

.slide > img {
  width: 100vw;
  height: 100vh;
  object-position: 50% 0%;
  object-fit: cover;
  display: block;
}

.headerPhoto {
  width: 100vw;
  height: 100vh;
  object-position: 50% 80%;
  object-fit: cover;
  opacity: 0;
  display: block;
}


.ma-2 {
  margin: 8px;
}

.larger-button {
  width: 200px; 
  height: 50px; 
  font-size: 16px;
}
</style>