<template>
    <section>
        <a href="your-url-here" class="circular-image" >
        </a>
        <div class="menu ">
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
        </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
import { signOutUser } from '@/services/firebase/firebaseAuthService';
import { useRouter } from 'vue-router';

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









const router = useRouter(); // Declare the router instance here
const authError = ref('');
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');

const handleSignOut = async () => {
  try {
    await signOutUser();
    router.push({ name: 'Login' }); // Replace 'Home' with the name of your home route
  } catch (error: any) {
    authError.value = error.message;
  }
};

const date = ref<string>(
    `${new Date().getFullYear()} -- ${new Date().getHours()}:${new Date().getMinutes()} 🥳`
);
 

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

.absolute {
  position: fixed;
  top: 0;
  right: 0;
}
</style>