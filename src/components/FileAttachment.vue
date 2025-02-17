<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      :accept="acceptedTypes"
      @change="handleFileSelected"
      class="hidden"
    />
    <button @click="openFilePicker" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const props = defineProps<{
  buttonText: string,
  fileType: 'receipt' | 'invoice'
}>();

const acceptedTypes = props.fileType === 'receipt' ? 'image/*' : 'application/pdf';
const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}


function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', props.fileType);

    store
      .dispatch('createRefundRequest', formData)
      .then((response: any) => {
        console.log('Upload successful:', response);
        const id = response.data.id;
        console.log('id:', id);
        const refundRequest = store.state.refundRequests.find((refundRequest: any) => refundRequest.id === id);
        
        console.log('refundRequest:', refundRequest);
        refundRequest.isExpanded = true;
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
</script>

<style scoped>
.btn-style {
  padding: 0.5em 1em;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
