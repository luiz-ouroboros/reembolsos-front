<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import ImageCapture from './ImageCapture.vue';

const store = useStore();

const props = defineProps<{
  buttonText: string,
  fileType: 'receipt' | 'invoice'
}>();

const showCapture = ref(false);

function openCapture() {
  showCapture.value = true;
}

function handleCaptureClose() {
  showCapture.value = false;
}

async function handleFileUpload(file: File | string) {
  let fileToUpload: File;
  if (typeof file === 'string') {
    const arr = file.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      console.error('Formato de imagem inválido');
      return;
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    fileToUpload = new File([u8arr], 'captured.png', { type: mime });
  } else {
    fileToUpload = file;
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('file_type', props.fileType);

  try {
    const response: any = await store.dispatch('createRefundRequest', formData);
    console.log('Upload successful:', response);
    const id = response.data.id;
    console.log('id:', id);
    const refundRequest = store.state.refundRequests.find((r: any) => r.id === id);
    if(refundRequest){
      refundRequest.isExpanded = true;
    }
  } catch(error) {
    console.error(error);
  }
}

function handleCaptured(capturedImage: string) {
  showCapture.value = false;
  handleFileUpload(capturedImage);
}

function handleAttached(file: File) {
  showCapture.value = false;
  handleFileUpload(file);
}
</script>

<template>
  <div>
    <button
      @click="openCapture"
      class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
    >
      {{ buttonText }}
    </button>
    <ImageCapture
      v-if="showCapture"
      @close="handleCaptureClose"
      @captured="handleCaptured"
      @attached="handleAttached"
    />
  </div>
</template>
