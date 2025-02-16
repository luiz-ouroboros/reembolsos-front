<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Bem-vindo, {{ user.username }}!</h1>
    <button
      @click="logout"
      class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const user = computed(() => store.state.user);

const logout = () => {
  try {
    store.dispatch('logoutUser')
      .then(() => { router.push('/login') })
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
</script>
