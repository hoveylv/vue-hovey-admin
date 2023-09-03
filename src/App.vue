<script setup lang="ts">
import { useLocale } from '@/locales/useLocale'

// 获取全局语言
const { getElementPlusLocale: locale } = useLocale()
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
