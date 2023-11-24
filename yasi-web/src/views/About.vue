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
      <!-- <a href="your-url-here" class="circular-image" >
      </a> -->
      <!-- <div class="menu ">
        <div class="menu-items">
          <div class="menu-item active" @click="defClick($event)">
            <svg width="24" height="24" viewBox="0 0 24 24" @click.stop="defClickChild($event)">
              <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4M12,11L20,6H4L12,11M4,18H20V8.37L12,13.36L4,8.37V18Z"></path>
            </svg>
          </div>
          <div class="menu-item" @click="defClick($event)">
            <svg width="24" height="24" viewBox="0 0 24 24" @click.stop="defClickChild($event)">
              <path d="M11.5,22C11.64,22 11.77,22 11.9,21.96C12.55,21.82 13.09,21.38 13.34,20.78C13.44,20.54 13.5,20.27 13.5,20H9.5A2,2 0 0,0 11.5,22M18,10.5C18,7.43 15.86,4.86 13,4.18V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V4.18C7.13,4.86 5,7.43 5,10.5V16L3,18V19H20V18L18,16M19.97,10H21.97C21.82,6.79 20.24,3.97 17.85,2.15L16.42,3.58C18.46,5 19.82,7.35 19.97,10M6.58,3.58L5.15,2.15C2.76,3.97 1.18,6.79 1,10H3C3.18,7.35 4.54,5 6.58,3.58Z"></path>
            </svg>
          </div>
          <div class="menu-item" @click="defClick($event)">
            <svg width="24" height="24" viewBox="0 0 24 24" @click.stop="defClickChild($event)">
              <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"></path>
            </svg>
          </div>
          <div class="menu-item" @click="defClick($event)">
            <svg width="24" height="24" viewBox="0 0 24 24" @click.stop="defClickChild($event)">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
            </svg>
          </div>
          <div class="indicator"></div>
        </div>
      </div> -->
    </section>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <div>
              <img id='img' src="">
            </div>
            
            <v-card class="pa-5 mt-5">
              <v-card-title class="text-h5">
                Special Birthday Wishes!
              </v-card-title>
              <v-card-text>
                <p>Happy Birthday to the most amazing person in my life! 🎉</p>
                <p>May your day be filled with joy, laughter, and all the love you deserve.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Buttons for sending emails -->
        <v-row class="text-center mt-5">
          <v-col>
            <v-btn color="primary" class="ma-2" @click="() => startSendingEmail('comeOver')">Come Over</v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" class="ma-2" @click="() => startSendingEmail('buyFood')">Buy yummi</v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" class="ma-2" @click="() => startSendingEmail('call')">Call</v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" class="ma-2" @click="() => startSendingEmail('<3')">💗</v-btn>
          </v-col>
        </v-row>
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
    <v-footer class="mt-10" color="primary" app>
      <span class="white--text">&copy; {{ date }} Birthday Celebration 🎁</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, reactive} from 'vue';
import emailjs from 'emailjs-com';
import { watchEffect } from 'vue';
import AppBar from '@/components/AppBar.vue';


const photoList = [
  {value: '/src/assets/photos/IMG_8309.jpg'},
  {value: '/src/assets/photos/IMG_9318.jpg'},
  {value: '/src/assets/photos/IMG_7297.jpg'},
  {value: 'src/assets/photos/IMG_20220124111201.PNG'},
  {value: '/src/assets/photos/IMG_7932.JPEG'},
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
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
      loading.value = false;
      snackbar.value = { show: true, message: 'Email se nepodařilo odeslat. 😵', succesful: false };
      console.log('FAILED...', error);
    });
};

const date = ref<string>(
    `${new Date().getFullYear()} -- ${new Date().getHours()}:${new Date().getMinutes()} 🥳`
);

function defClick(event: any) {
  const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

function defClickChild(event: any){
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  if(event.target.parentElement.parentElement.classList.contains('menu-items')){
    event.target.parentElement.classList.add('active');
  } else {
    event.target.parentElement.parentElement.classList.add('active');
  }
}

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style lang="scss">

$items: 4;
$width: 1 / $items;

$colors: #ed254e, #10c15c, #91c4f2, #9d79bc;
// $active-color: nth($colors, 1);

.menu {
  position: absolute;
  z-index: 1000;
  width: 600px;
  top: 5px;
  right: 5px;
  margin: 1rem;
  box-sizing: border-box;
  max-width: 100%;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 0 0;
  background: #ffffff;
  overflow: hidden;
}

.menu-items {
  display: flex;
  width: 100%;
  position: relative;
}

.menu-item {
  color: #ededed;
  cursor: pointer;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  transition: all 0.3s ease-in-out;
  padding-bottom: 5px;

  &.active {
    transform: scale(1.3);
  }

  & svg {
    fill: currentColor;
  }
}

.indicator {
  user-select: none;
  pointer-events: none;
  position: absolute;
  height: 5px;
  // background: $active-color;
  bottom: 0px;
  transition: all 0.3s ease-in-out;
  width: percentage($width);
}

@for $i from 1 through $items {
  .menu-item:nth-of-type(#{$i}) {
    &.active {
      color: nth($colors, $i);
    }
    &.active ~ .indicator {
      left: percentage($width * ($i - 1));
      background: nth($colors, $i);
    }
  }
}

/* Landing Page Styles */

@keyframes slideToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1%); /* Adjust this value as needed */
  }
}

@keyframes slideBack {
  0% {
    transform: translateX(-1%); /* Adjust this value as needed */
  }
  100% {
    transform: translateX(0);
  }

}

.slide {
  position: absolute;
  inset: 0; 
  opacity: 0;
  scale: 1.11;
  transition: 800ms opacity ease-in-out;
  transition-delay: 800ms;
  animation-delay: 1000ms;
  animation: slideBack 600ms ease-in-out forwards;
}

.activeSlide {
  opacity: 1;
  transition-delay: 0ms;
  scale: 1.11;
  animation-delay: 1600ms;
  animation: slideToLeft 5000ms linear forwards;
}

.slide > img {
  width: 100vw;
  height: 100vh;
  object-position: 50% 80%;
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

.circular-image {
  border-radius: 50%;
  position: fixed;
  overflow: hidden;
  background: url('@/assets/photos/B2DCB4B0-7CDF-40EF-B6F6-377075B3C04C.JPEG') no-repeat center center; 
  background-size: cover;
  height: 100px;
  width: 100px;
  top: 15px;
  left: 15px;

}

.ma-2 {
  margin: 8px;
}

.v-btn {
  width: 200px; /* Set button width */
  height: 50px; /* Set button height */
  font-size: 16px; /* Set font size */
}
</style>