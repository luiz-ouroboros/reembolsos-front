<template>
  <div class="relative">
    <div class="flex items-center">
      <input
        type="text"
        v-model="searchTerm"
        :readonly="!isEditable"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
        class="mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        placeholder="Selecione ou crie um fornecedor"
      />
      <button
        @click="handleEnter"
        type="button"
        class="mt-1 px-3 py-2 border border-gray-300 bg-white rounded-r-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
      >
        +
      </button>
    </div>
    <ul
      v-if="showDropdown && filteredSuppliers.length > 0 && isEditable"
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto"
    >
      <li
        v-for="supplier in filteredSuppliers"
        :key="supplier.id"
        @mousedown.prevent="selectSupplier(supplier)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ supplier.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

interface Supplier {
  id: number;
  name: string;
}

interface RefundRequest {
  id: number;
  supplier_id?: number;
  status: string;
}

const props = defineProps<{
  editable: boolean;
  refundRequest: RefundRequest;
}>();

const emit = defineEmits<{
  (e: 'supplier-selected', supplier: Supplier): void;
}>();

const store = useStore();

const searchTerm = ref('');
const showDropdown = ref(false);
const finalSuppliers = ref(store.state.suppliers);

const isEditable = computed(() => props.editable);

const filteredSuppliers = computed(() => {
  if (!searchTerm.value) return finalSuppliers.value;
  return finalSuppliers.value.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function selectSupplier(supplier: Supplier) {
  searchTerm.value = supplier.name;
  emit('supplier-selected', supplier);
  showDropdown.value = false;
}

function handleEnter() {
  const trimmedName = searchTerm.value.trim();
  if (isEditable.value && filteredSuppliers.value.length === 0 && trimmedName) {
    store.dispatch('createSupplier', { name: trimmedName })
      .then((response) => {
        if (response && response.data) {
          const createdSupplier: Supplier = response.data;
          searchTerm.value = createdSupplier.name;
          emit('supplier-selected', createdSupplier);
        }
        showDropdown.value = false;
      })
      .catch((error) => {
        console.error(error);
        showDropdown.value = false;
      });
  }
}

function handleFocus() {
  if (isEditable.value) {
    showDropdown.value = true;
  }
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
}

function initializeSupplier() {
  if (props.refundRequest.supplier_id) {
    const selected = finalSuppliers.value.find(
      (supplier) => supplier.id === props.refundRequest.supplier_id
    );
    if (selected) {
      searchTerm.value = selected.name;
    }
  }
}

onMounted(() => {
  initializeSupplier();
});

watch(
  () => [props.refundRequest.supplier_id, finalSuppliers.value],
  () => {
    initializeSupplier();
  },
  { immediate: true }
);
</script>

<style scoped>
</style>
