<template>
  <NotFoundView v-if="notFound.notFound" />
  <router-view v-else />
</template>

<script setup lang="ts">
  import { useNotFound } from '@/store/not-found/not-found';
  import NotFoundView from '@/views/NotFoundView.vue';

  const notFound = useNotFound();
</script>
