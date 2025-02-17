<template>
  <div>
    <input
      type="text"
      v-model="search"
      @keyup.enter="executeSearch"
      @input="checkInput"
      placeholder="Buscar..."
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const search = ref('')

function executeSearch() {
  store.commit('setSearch', search.value)
  store.dispatch('loadRefundRequests')
}

function checkInput() {
  executeSearch()
}
</script>
