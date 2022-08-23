<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<template>
  <div class="text-yellow-600">tag</div>
  <el-button>{{ t('button.toggle_dark') }}</el-button>
</template>

<style lang="scss" scoped></style>
