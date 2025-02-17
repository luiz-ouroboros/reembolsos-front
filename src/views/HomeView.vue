<template>
  <div class="min-h-screen bg-red-100 p-4">
    <div class="max-w-md mx-auto">
      <div class="space-y-4">
        <OptionsView></OptionsView>
        <RefundRequestListView></RefundRequestListView>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import OptionsView from './OptionsView.vue';
import RefundRequestListView from './RefundRequestListView.vue';
import { useStore } from 'vuex';

const store = useStore();

onMounted(() => {
  store.dispatch('loadSuppliers')
  store.dispatch('loadTags')
  store.dispatch('loadRefundRequests')
});
</script>
