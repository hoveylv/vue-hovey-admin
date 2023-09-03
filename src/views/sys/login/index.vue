<script setup lang="ts">
import { Lock, Picture, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { illustration } from './illustrations'
import { loginRules } from './rules'
import Motion from './motion'

import phone from './phone.vue'
import qrCode from './qrCode.vue'
import regist from './regist.vue'
import update from './update.vue'
import darkIcon from '@/assets/svg/dark.svg?component'
import dayIcon from '@/assets/svg/day.svg?component'
import bg from '@/assets/login/bg.png'

const isDark = ref(false)
const toggleDark = (v: boolean) => {
  document.documentElement.classList.toggle('dark')
  isDark.value = v
}

const loginForm = reactive({
  account: 'admin',
  password: '123456',
  verifyCode: '',
})
const loginFormRef = ref<FormInstance>()
const imgCode = ref('')
const loading = ref(false)
const checked = ref(false)
const currentPage = computed(() => {
  return 0
})

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      /// Todo: 登录
    } else {
      loading.value = false
      return fields
    }
  })
}
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />

    <div class="flex-col absolute right-5 top-3" @click.stop>
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
        @change="toggleDark(isDark)"
      />
      <lang-select></lang-select>
    </div>

    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- <Motion class="mb-12">
            <h2 class="outline-none">
              <span class="text-blue">vue-hovey-admin</span>
            </h2>
          </Motion> -->
          <el-form
            v-if="currentPage === 0"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('sys.login.accountRule'),
                    trigger: 'blur',
                  },
                ]"
                prop="account"
              >
                <el-input
                  v-model="loginForm.account"
                  clearable
                  :placeholder="$t('sys.login.accountPlaceholder')"
                  :prefix-icon="User"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  clearable
                  show-password
                  :placeholder="$t('sys.login.passwordPlaceholder')"
                  :prefix-icon="Lock"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  v-model="loginForm.verifyCode"
                  clearable
                  :placeholder="$t('sys.login.verifyCodePlaceholder')"
                  :prefix-icon="Picture"
                >
                  <template #append>
                    <image-verify v-model:code="imgCode" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="checked">
                    {{ $t('sys.login.rememberMe') }}
                  </el-checkbox>
                  <el-button link type="primary" @click="onLogin(loginFormRef)">
                    {{ $t('sys.login.forgetPassword') }}
                  </el-button>
                </div>
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  @click="onLogin(loginFormRef)"
                >
                  {{ $t('sys.login.loginButton') }}
                </el-button>
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button class="w-full mt-4" size="default">
                    {{ $t('sys.login.phoneLogin') }}
                  </el-button>
                  <el-button class="w-full mt-4" size="default">
                    {{ $t('sys.login.qRCodeLogin') }}
                  </el-button>
                  <el-button class="w-full mt-4" size="default">
                    {{ $t('sys.login.register') }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>

          <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-gray-500 text-xs">
                  {{ $t('sys.login.thirdLogin') }}
                </p>
              </el-divider>
              <div class="w-full flex justify-evenly">
                <div
                  :title="$t('sys.login.weChatLogin')"
                  class="i-ri:wechat-fill cursor-pointer text-gray-500 hover:text-blue-400 w-6 h-6"
                />

                <div
                  :title="$t('sys.login.alipayLogin')"
                  class="i-ri:alipay-fill cursor-pointer text-gray-500 hover:text-blue-400 w-6 h-6"
                />

                <div
                  :title="$t('sys.login.qqLogin')"
                  class="i-ri:qq-fill cursor-pointer text-gray-500 hover:text-blue-400 w-6 h-6"
                />

                <div
                  :title="$t('sys.login.weiboLogin')"
                  class="i-ri:weibo-fill cursor-pointer text-gray-500 hover:text-blue-400 w-6 h-6"
                />
              </div>
            </el-form-item>
          </Motion>
          <!-- 手机号登录 -->
          <phone v-if="currentPage === 1" />
          <!-- 二维码登录 -->
          <qrCode v-if="currentPage === 2" />
          <!-- 注册 -->
          <regist v-if="currentPage === 3" />
          <!-- 忘记密码 -->
          <update v-if="currentPage === 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('@/styles/login.scss');

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
