<template>
  <div class="flex justify-between">
    <FileAttachment buttonText="Add Recibo" fileType="receipt" />
    <FileAttachment buttonText="Add NF-e" fileType="invoice" />
  </div>
  <div>
    <SearchInput />
  </div>
</template>

<script lang="ts" setup>
import FileAttachment from '../components/FileAttachment.vue';
import SearchInput from '../components/SearchInput.vue'
</script>
