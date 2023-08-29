<script setup lang="ts">
import { getCaptchaApi } from './api/auth'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const captchaBase64 = ref()
const verifyCode = ref()

function getCaptcha() {
  getCaptchaApi().then(({ data }) => {
    const { verifyCodeBase64, verifyCodeKey, customProperty } = data

    captchaBase64.value = verifyCodeBase64
    verifyCode.value = verifyCodeKey

    console.log(verifyCodeBase64, verifyCodeKey, customProperty)
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<template>
  <el-config-provider :locale="appStore.locale">
    <el-link type="success">{{ verifyCode }}</el-link>
    <div class="captcha">
      <img :src="captchaBase64" @click="getCaptcha" />
    </div>
    <router-view></router-view>
    <el-button type="primary">{{ $t('button.back') }}</el-button>
    <el-button type="default">{{ $t('button.go') }}</el-button>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.captcha {
  position: absolute;
  top: 0;
  right: 0;

  img {
    width: 120px;
    height: 48px;
    cursor: pointer;
  }
}
</style>
