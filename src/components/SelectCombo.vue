<template>
  <label v-if="label_prop" :for="key_prop" class="block font-medium text-gray-700">{{label_prop}}</label>
  <div class="relative">
    <div class="flex items-center">
      <input
        type="text"
        v-model="searchTerm"
        :readonly="!isEditable"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup="showDropdown = true"
        @keyup.enter="handleEnter"
        class="mt-1 block flex-grow px-3 py-2 border border-gray-300 shadow-sm focus:outline-none"
        :placeholder="placeholder || isCreateble ? 'Selecione ou crie um novo' : 'Selecione'"
        :class="isCreateble ? `${ inputClass || '' } cursor-pointer rounded-l-md` : `${ inputClass || '' } rounded-md`"
      />
      <button
        v-if="isClearable && searchTerm"
        type="button"
        @click="handleClear"
        class="absolute inset-y-0 right-0 flex items-center mr-12 text-gray-500 hover:text-gray-700"
      >
        x
      </button>
      <button
        v-if="isCreateble"
        @click="handleEnter"
        type="button"
        class="mt-1 px-3 py-2 border border-gray-300 bg-white rounded-r-md shadow-sm hover:bg-gray-100 focus:outline-none"
        :class="inputClass"
      >
        +
      </button>
    </div>
    <ul
      v-if="showDropdown && filteredItems.length > 0 && isEditable"
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto"
    >
      <li
        v-for="item in filteredItems"
        :key="key_prop"
        @mousedown.prevent="selectItem(item)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ item[value_prop] }}
      </li>
    </ul>
  </div>
  <div v-if="validator && validator.$error" class="text-red-500 text-sm">
    <span v-if="validator.$errors.find(e => e.$validator === 'required')">{{label_prop}} é obrigatória.</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  items: Object[];
  editable?: boolean | null;
  createble?: boolean | null;
  clearable?: boolean | null;
  selected_item?: object | null;
  key_prop?: string | null;
  value_prop?: string | null;
  label_prop?: string | null;
  inputClass?: string | null;
  placeholder?: string | null;
  validator?: any;
}>();

const emit = defineEmits<{
  (e: 'item-selected', item: Object): void;
  (e: 'item-createde', item: Object): void;
  (e: 'item-cleared'): void;
}>();

const searchTerm = ref('');
const showDropdown = ref(false);
const isEditable = ref(props.editable || false);
const isCreateble = ref(props.createble || false);
const isClearable = ref(props.clearable || false);
const key_prop = props.key_prop || 'id';
const value_prop = props.value_prop || 'name';
const selectedItem = ref(props.selected_item || null);


const filteredItems = computed(() => {
  if (!searchTerm.value) return props.items;

  return props.items.filter(item =>
    item[value_prop].toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function selectItem(item) {
  searchTerm.value = item[value_prop];
  emit('item-selected', item);
  showDropdown.value = false;
}

function handleEnter() {
  const trimmedValue = searchTerm.value.trim();
  if (isCreateble.value && filteredItems.value.length === 0 && trimmedValue) {
    const obj = new Object();
    obj[value_prop] = trimmedValue;

    emit('item-createde', obj);
  } else if (isClearable.value && trimmedValue) {
    emit('item-cleared');
  } 
}

function handleClear() {
  searchTerm.value = '';
  emit('item-cleared');
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

function initializeItem() {
  if (selectedItem.value) {
    searchTerm.value = selectedItem.value[value_prop] || '';
  }
}

onMounted(() => {
  initializeItem();
});

watch(
  () => [selectedItem.value, props.items],
  () => {
    initializeItem();
  },
  { immediate: true }
);
</script>

<style scoped>
</style>
