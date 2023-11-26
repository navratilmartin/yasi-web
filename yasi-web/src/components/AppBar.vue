<template>
        <a href="/" class="circular-image" >
        </a>
        <v-alert v-if="authError" type="error" class="mt-2">{{ authError }}</v-alert>
        <div class="menu">
            <div class="menu-items">
            <router-link to="/" id="home" class="menu-item">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                </svg>
            </router-link >
            <router-link to="/route" id="route" class="menu-item">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M15,14C12.3,14 7,15.3 7,18V20H23V18C23,15.3 17.7,14 15,14M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12M5,15L4.4,14.5C2.4,12.6 1,11.4 1,9.9C1,8.7 2,7.7 3.2,7.7C3.9,7.7 4.6,8 5,8.5C5.4,8 6.1,7.7 6.8,7.7C8,7.7 9,8.6 9,9.9C9,11.4 7.6,12.6 5.6,14.5L5,15Z" />
                </svg>
            </router-link>
            <router-link to="/photos" id="photos" class="menu-item">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                </svg>
            </router-link>
            <div class="menu-item" @click="handleSignOut" style="scale: 1.15">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" color="red">
                    <path d="M17 8L15.6 9.4L17.2 11H9V13H17.2L15.6 14.6L17 16L21 12L17 8M5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5Z" />
                </svg>
            </div>
            <div class="indicator"></div>
            </div>
        </div>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { signOutUser } from '@/services/firebase/firebaseAuthService';
import { useRouter } from 'vue-router';

const router = useRouter(); // Declare the router instance here
const authError = ref('');

const handleSignOut = async () => {
  try {
    await signOutUser();
    router.push({ name: 'Login' }); // Replace 'Home' with the name of your home route
  } catch (error: any) {
    authError.value = error.message;
  }
};

// function defClick(event: any) {
//   const menuItems = document.querySelectorAll('.menu-item');
//     menuItems.forEach(item => item.classList.remove('active'));
//     console.log(document.getElementById(event.target.id)?.classList)
//     document.getElementById(event.target.id)?.classList.add('active');
//     console.log('after',document.getElementById(event.target.id)?.classList)
//     // event.target.classList.add('active');
// }

// function defClickChild(event: any){
//   const menuItems = document.querySelectorAll('.menu-item');
//   menuItems.forEach(item => item.classList.remove('active'));
//   if(event.target.parentElement.parentElement.classList.contains('menu-items')){
//     event.target.parentElement.classList.add('active');
//   } else {
//     event.target.parentElement.parentElement.classList.add('active');
//   }
// }
</script>
<style lang="scss">
$items: 4;
$width: 1 / $items;

$colors: #E281D3, #10c15c, #91c4f2, #9d79bc;
// $active-color: nth($colors, 1);

.menu {
  position: absolute;
  z-index: 1000;
  width: 600px;
  top: 0px;
  right: 20px;
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

.circular-image {
  border-radius: 50%;
  position: fixed;
  overflow: hidden;
  background: url('@/assets/love.JPEG') no-repeat center center; 
  background-size: cover;
  height: 100px;
  width: 100px;
  top: 10px;
  left: 15px;
}
// // NavBar css hotovo

.absolute {
  position: fixed;
  top: 0;
  right: 0;
}
</style>