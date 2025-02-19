<template>
  <div class="bg-white p-1 rounded-lg shadow-md">
    <div class="flex items-center">
      <input
        type="text"
        v-model="search"
        @keyup.enter="executeSearch"
        @input="checkInput"
        placeholder="Buscar..."
        class="block flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
      />
      <button
        type="button"
        @click="executeSearch"
        class="px-3 py-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <button
        type="button"
        @click="toggleExpanded"
        class="px-3 py-2 border border-gray-300 bg-white rounded-r-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
      >
        {{ isExpanded ? '▲' : '▼' }}
      </button>
    </div>
    <transition name="expand">
      <div v-if="isExpanded" class="mt-2 space-y-2">
        <div>
          <div class="relative">
            <input
              id="supplier-input"
              type="text"
              v-model="supplierQuery"
              @input="onSupplierInput"
              @focus="showSupplierSuggestions = true"
              @blur="hideSupplierSuggestions"
              placeholder="Filtrar por Fornecedor"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              autocomplete="off"
            />
            <button
              v-if="supplierQuery"
              type="button"
              @click="clearSupplier"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <ul
              v-if="showSupplierSuggestions && filteredSuppliers.length"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <li
                v-for="supplier in filteredSuppliers"
                :key="supplier.id"
                @mousedown.prevent="selectSupplier(supplier)"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ supplier.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const search = ref('')
const isExpanded = ref(false)

const supplierQuery = ref('')
const selectedSupplier = ref('')
const showSupplierSuggestions = ref(false)
const suppliers = computed(() => store.state.suppliers || [])

const filteredSuppliers = computed(() => {
  if (!supplierQuery.value) {
    return suppliers.value
  }
  return suppliers.value.filter((supplier: { name: string }) =>
    supplier.name.toLowerCase().includes(supplierQuery.value.toLowerCase())
  )
})

function executeSearch() {
  store.commit('setSearch', search.value)
  store.dispatch('loadRefundRequests')
}

function checkInput() {
  executeSearch()
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value

  if (isExpanded.value && suppliers.value.length === 0) {
    store.dispatch('loadSuppliers')
  }
}

function onSupplierInput() {
  showSupplierSuggestions.value = true
}

function selectSupplier(supplier: { id: number; name: string }) {
  selectedSupplier.value = supplier.id.toString()
  supplierQuery.value = supplier.name
  showSupplierSuggestions.value = false
  onSupplierSelect()
}

function hideSupplierSuggestions() {
  setTimeout(() => {
    showSupplierSuggestions.value = false
  }, 200)
}

function onSupplierSelect() {
  store.commit('setSupplierFilter', selectedSupplier.value)
  store.dispatch('loadRefundRequests')
}

function clearSupplier() {
  supplierQuery.value = ''
  selectedSupplier.value = ''
  store.commit('setSupplierFilter', '')
  store.dispatch('loadRefundRequests')
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
