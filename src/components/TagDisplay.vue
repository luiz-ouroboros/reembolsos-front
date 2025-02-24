<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="tag in tags"
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
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Tag {
  id: number;
  name: string;
}

const props = defineProps<{
  tags: Tag[];
  editable: boolean;
}>()

const emit = defineEmits<{
  (e: 'tag-removed', tag: Tag): void;
}>();

const tags = computed(() => props.tags || []);
const isEditable = computed(() => props.editable || false);

function removeTag(tag: Tag) {
  emit('tag-removed', tag);
}
</script>

<style scoped>
</style>
