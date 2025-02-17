<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="bg-gray-200 px-2 py-1 rounded flex items-center"
      >
        {{ tag.name }}
        <button
          v-if="isEditable"
          @click="removeTag(tag)"
          type="button"
          class="ml-1 text-red-500"
        >
          x
        </button>
      </span>
    </div>
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        v-model="searchTerm"
        :readonly="!isEditable"
        @focus="handleFocus"
        @keydown.enter.prevent="handleEnter"
        @blur="handleBlur"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        placeholder="Selecione ou crie uma tag"
      />
      <ul
        v-if="showDropdown && filteredTags.length > 0 && isEditable"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto"
      >
        <li
          v-for="tag in filteredTags"
          :key="tag.id"
          @mousedown.prevent="selectTag(tag)"
          class="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {{ tag.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

interface Tag {
  id: number;
  name: string;
}

interface RefundRequest {
  id: number;
  tag_ids?: number[];
  status: string;
}

const props = defineProps<{
  refundRequest: RefundRequest;
}>()

const store = useStore()
const tags = computed(() => store.state.tags)

const searchTerm = ref('')
const showDropdown = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const isEditable = computed(() => props.refundRequest.status === 'draft')

const selectedTags = computed(() => {
  if (!props.refundRequest.tag_ids) return []
  return tags.value.filter((tag) => props.refundRequest.tag_ids!.includes(tag.id))
})

const filteredTags = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return tags.value.filter((tag) => {
    if (props.refundRequest.tag_ids && props.refundRequest.tag_ids.includes(tag.id)) {
      return false
    }
    if (!term) return true
    return tag.name.toLowerCase().includes(term)
  })
})

function selectTag(tag: Tag) {
  emit('tag-selected', tag)
  searchTerm.value = ''
  showDropdown.value = false
  inputRef.value?.focus()
}

function handleEnter() {
  if (isEditable.value && searchTerm.value.trim()) {
    if (filteredTags.value.length === 0) {
      emit('create-tag', searchTerm.value.trim())
      searchTerm.value = ''
      showDropdown.value = false
      inputRef.value?.focus()
    }
  }
}

function handleFocus() {
  if (isEditable.value) {
    showDropdown.value = true
  }
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

function removeTag(tag: Tag) {
  if (isEditable.value) {
    emit('remove-tag', tag)
    inputRef.value?.focus()
  }
}

const emit = defineEmits<{
  (e: 'tag-selected', tag: Tag): void;
  (e: 'remove-tag', tag: Tag): void;
  (e: 'create-tag', tagName: string): void;
}>()
</script>

<style scoped>
</style>
