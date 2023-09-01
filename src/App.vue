<script setup lang="ts">
import { useLocale } from '@/locales/useLocale'

const { getElementPlusLocale: locale } = useLocale()
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
