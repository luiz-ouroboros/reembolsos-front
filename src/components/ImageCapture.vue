<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
  (e: 'close', payload: false): void;
  (e: 'captured', capturedImage: string): void;
  (e: 'attached', file: File): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let stream: MediaStream | null = null;
let animationFrameId: number | null = null;

const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

const isCaptured = ref(false);
const capturedImage = ref<string | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);

async function startStream() {
  if (video.value && canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.value.srcObject = stream;
      await video.value.play();
      draw();
    } catch (err) {
      console.error(err);
    }
  }
}

function draw() {
  if (!isCaptured.value && video.value && canvas.value && ctx.value) {
    ctx.value.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    animationFrameId = requestAnimationFrame(draw);
  }
}

function capturePhoto() {
  if (canvas.value) {
    capturedImage.value = canvas.value.toDataURL('image/png');
    isCaptured.value = true;
    if (video.value) {
      video.value.pause();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

function retry() {
  isCaptured.value = false;
  capturedImage.value = null;
  if (video.value) {
    video.value.play();
    draw();
  }
}

function confirmCapture() {
  if (capturedImage.value) {
    emit('captured', capturedImage.value);
  }
}

function goBack() {
  emit('close', false);
}

function openFileChooser() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    emit('attached', file);
  }
  if (target) {
    target.value = '';
  }
}

onMounted(() => {
  startStream();
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});
</script>

<template>
  <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: black; z-index: 9999;">
    <canvas ref="canvas" width="1280" height="720" style="width: 100vw; height: 100vh;"></canvas>
    <video ref="video" autoplay playsinline webkit-playsinline muted hidden></video>
    <input ref="fileInput" type="file" accept="image/*,application/pdf" style="display: none" @change="onFileChange" />
    <div style="position: absolute; bottom: 70px; width: 100%; display: flex; justify-content: center; gap: 10px;">
      <template v-if="!isCaptured">
        <button @click="goBack" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Voltar</button>
        <button @click="capturePhoto" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Capturar</button>
        <button @click="openFileChooser" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Anexar</button>
      </template>
      <template v-else>
        <button @click="retry" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Tentar novamente</button>
        <button @click="confirmCapture" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">OK</button>
      </template>
    </div>
  </div>
</template>
