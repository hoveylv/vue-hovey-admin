<script setup lang="ts">
  import { useDateFormat, useNow, useTimeAgo } from '@vueuse/core'
  const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')

  const timeAgo = useTimeAgo(new Date(2022, 16, 32))
</script>

<template>
  <div class="text-red-500">
    <div>{{ formatted }}</div>
    <div>{{ timeAgo }}</div>
  </div>
</template>

<style scoped></style>
