<template>
  <div>
    <nav class="bg-blue-600 p-4" v-if="$route.name !== 'Login'">
      <router-link to="/home" class="text-white mr-4">Home</router-link>
      <button @click="logout" class="text-white">Logout</button>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const logout = () => {
  store.dispatch('logoutUser');
  router.push('/login');
};
</script>