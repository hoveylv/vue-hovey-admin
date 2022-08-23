<script setup lang="ts">
  import { useDateFormat, useNow, useTimeAgo } from '@vueuse/core'
  import Tag from '@/components/Tag.vue'
  import illustration0 from './assets/login/illustration0.svg?component'

  const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
  const timeAgo = useTimeAgo(new Date(2022, 16, 32))
</script>

<template>
  <div class="text-red-500">
    <div>{{ formatted }}</div>
    <button class="i-carbon-wikis dark:i-carbon-moon w-8 h-8" />
    <div>{{ timeAgo }}</div>
    <Tag></Tag>
    <illustration0
      v-motion
      :initial="{
        y: 100,
        opacity: 0,
      }"
      :enter="{
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 320,
          damping: 20,
          delay: 50 * 1,
          onComplete: () => {},
        },
      }"
      :levitate="{
        y: 15,
        transition: {
          duration: 1500,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'mirror',
        },
      }"
    />
  </div>
</template>

<style scoped></style>
