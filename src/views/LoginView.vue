<template>
  <div class="min-h-screen bg-red-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <div class="flex justify-center mb-6">
        <img src="/logo.png" alt="Logo" class="h-24" />
      </div>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const store = useStore();
const router = useRouter();

const login = () => {
  store.dispatch('loginUser', {
    email: email.value,
    password: password.value,
  }).then(() => {
    router.push('/home');
  }).catch((error) => {
    alert('Erro ao fazer login. Verifique suas credenciais.');
    console.error(error);
  });
};
</script>
