<template>
  <RefundRequest
    v-for="refund in store.state.refundRequests"
    :key="refund.id"
    :refundRequest="refund"
  ></RefundRequest>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import RefundRequest from '../components/RefundRequest.vue';

const store = useStore();
</script>
