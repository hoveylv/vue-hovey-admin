<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<template>
  <el-config-provider :locale="appStore.locale">
    <router-view></router-view>
    <el-button type="primary">{{ $t('button.back') }}</el-button>
    <el-button type="default">{{ $t('button.go') }}</el-button>
  </el-config-provider>
</template>
