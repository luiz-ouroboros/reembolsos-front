<template>
  <div>
    <button @click="openCapture" class="btn-style">{{ buttonText }}</button>
    <ImageCapture v-if="showCapture" @capture="handleCapture" @close="closeCapture" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api'
import ImageCapture from './ImageCapture.vue'

const props = defineProps<{
  buttonText: string,
  fileType: 'receipt' | 'invoice'
}>()

const showCapture = ref(false)

function openCapture() {
  showCapture.value = true
}

function closeCapture() {
  showCapture.value = false
}

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',')
  console.log('arr', arr)
  const mimeMatch = arr[0].match(/:(.*?);/)
  console.log('mimeMatch', mimeMatch)
  if (!mimeMatch) {
    throw new Error('Invalid data URL')
  }
  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while(n--){
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

async function handleCapture(imageData: string) {
  const file = dataURLtoFile(imageData, 'capture.png')
  const formData = new FormData()
  formData.append('file', file)
  formData.append('file_type', props.fileType)
  try {
    const response = await api.post('/refund_requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('Upload successful:', response)
  } catch (error) {
    console.error('Error uploading file:', error)
  } finally {
    showCapture.value = false
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
