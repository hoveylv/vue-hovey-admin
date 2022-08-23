<script lang="ts" setup>
  import { ref, reactive, watch, computed } from 'vue'
  import { bg, avatar, currentWeek } from './utils/static'
  import Globalization from '@/assets/svg/globalization.svg?component'
  import DayIcon from '@/assets/svg/day.svg?component'
  import DarkIcon from '@/assets/svg/dark.svg?component'
  import { useRenderIcon, IconifyIconOnline } from '@/components/HoveyIcon'
  import Motion from './utils/motion'
  import { loginRules } from './utils/rules'
  import HoveyImageVerify from '@/components/HoveyImageVerify'
  import { operates, thirdParty } from './utils/enums'
  import type { FormInstance } from 'element-plus'

  const imgCode = ref('')
  const loading = ref(false)
  const checked = ref(false)
  const ruleFormRef = ref<FormInstance>()

  const dataTheme = ref(false)

  const ruleForm = reactive({
    username: 'hovey',
    password: '123456',
    verifyCode: '',
  })
</script>

<template>
  <div class="w-full h-full select-none">
    <img :src="bg" class="fixed h-full left-0 bottom-0 z--1" />
    <div class="flex justify-center items-center absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch v-model="dataTheme" inline-prompt :active-icon="DayIcon" :inactive-icon="DarkIcon" @change="" />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization
          class="hover:color-primary !hover:bg-transparent w-20px h-20px ml-1.5 cursor-pointer outline-none duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item>简体中文</el-dropdown-item>
            <el-dropdown-item>English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="w-100vw h-100vh grid grid-cols-2 gap-72 py-0 px-2rem">
      <div class="flex justify-end items-center">
        <component :is="currentWeek" class="w-500px" />
      </div>
      <div class="flex items-center text-center">
        <div class="w-360px">
          <avatar class="w-350px h-80px"></avatar>
          <Motion>
            <h2 class="outline-none uppercase my-15px mx-0 text-#999 font-bold text-200% font-mono">Hovey admin</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon('fa-user')"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon('fa-lock')"
                ></el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  clearable
                  v-model="ruleForm.verifyCode"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line', { online: true })"
                >
                  <template v-slot:append>
                    <HoveyImageVerify v-model:code="imgCode" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-20px flex justify-between items-center">
                  <el-checkbox v-model="checked">
                    {{ '记住密码' }}
                  </el-checkbox>
                  <el-button link type="primary" @click="">
                    {{ '忘记密码' }}
                  </el-button>
                </div>
                <el-button class="w-full mt-4" size="default" type="primary" :loading="loading" @click="">
                  {{ '登录' }}
                </el-button>
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-20px flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click=""
                  >
                    {{ item.title }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="350">
              <el-form-item>
                <el-divider>
                  <p class="text-gray-500 text-xs">{{ '第三方登录' }}</p>
                </el-divider>
                <div class="w-full flex justify-evenly">
                  <span v-for="(item, index) in thirdParty" :key="index" :title="item.title">
                    <IconifyIconOnline
                      :icon="`ri:${item.icon}-fill`"
                      width="20"
                      class="cursor-pointer text-gray-500 hover:text-blue-400"
                    />
                  </span>
                </div>
              </el-form-item>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-input-group__append, .el-input-group__prepend) {
    padding: 0;
  }

  :deep(input.el-input__inner) {
    font-size: 1.3em !important;
  }
</style>
