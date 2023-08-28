<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import type { LocaleType } from '@/types/config'
import { changeLocale } from '@/locales'

const appStore = useAppStore()

async function handleLanguageChange(lang: LocaleType) {
  await changeLocale(lang)
}
</script>

<template>
  <el-dropdown
    trigger="click"
    class="cursor-pointer"
    @command="handleLanguageChange"
  >
    <div><svg-icon icon-class="language"></svg-icon></div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="appStore.language === 'zh_CN'"
          command="zh_CN"
          >中文</el-dropdown-item
        >
        <el-dropdown-item :disabled="appStore.language === 'en'" command="en"
          >English</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
