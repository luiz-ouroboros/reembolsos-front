<template>
  <div v-if="isCameraOpen" class="fixed inset-0 bg-black flex flex-col justify-center items-center">
    <video ref="videoElement" autoplay class="w-full h-full object-cover"></video>

    <div class="absolute bottom-4 flex space-x-4">
      <button @click="closeCamera" class="bg-red-500 text-white px-4 py-2 rounded">
        Cancelar
      </button>
      <button @click="captureImage" class="bg-blue-500 text-white px-4 py-2 rounded">
        Capturar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const videoElement = ref<HTMLVideoElement | null>(null);
const isCameraOpen = ref(false);
const mediaStream = ref<MediaStream | null>(null);

const emit = defineEmits<{
  (event: 'capture', image: string): void;
  (event: 'close'): void;
}>();

async function openCamera() {
  try {
    const constraints = {
      video: { facingMode: 'environment' },
    };
    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream.value;
    }
    isCameraOpen.value = true;
  } catch (error) {
    console.error('Erro ao acessar a câmera:', error);
    alert('Não foi possível acessar a câmera.');
  }
}

function captureImage() {
  if (videoElement.value) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      emit('capture', imageData);
      closeCamera();
    }
  }
}

function closeCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
  isCameraOpen.value = false;
  emit('close'); 
}


onMounted(() => {
  openCamera();
});


onUnmounted(() => {
  closeCamera();
});
</script>

<style scoped>
</style>