<script setup lang="ts">
import type { LocaleType } from '@/types/config'
import { useLocale } from '@/locales/useLocale'

const { changeLocale, language } = useLocale()

async function handleLanguageChange(lang: LocaleType) {
  await changeLocale(lang)
  // console.log('output->language', language)
  // console.log('output->i18n', i18n.global.locale)
  // console.log(
  //   'output->getLocaleMessage',
  //   i18n.global.getLocaleMessage(i18n.global.locale as string)
  // )
}
</script>

<template>
  <el-dropdown
    trigger="click"
    class="cursor-pointer p2"
    @command="handleLanguageChange"
  >
    <div>
      <svg-icon
        icon-class="language"
        class="hover:text-primary text-4"
      ></svg-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh_CN'" command="zh_CN"
          ><div class="i-openmoji:flag-china text-2xl mr-2"></div>
          {{ $t('sys.locales.chinese') }}</el-dropdown-item
        >
        <el-dropdown-item :disabled="language === 'en'" command="en"
          ><div class="i-openmoji:flag-england text-2xl mr-2"></div>
          {{ $t('sys.locales.english') }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
