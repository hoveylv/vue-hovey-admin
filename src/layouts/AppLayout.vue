<script lang="ts" setup>
import { ref } from 'vue'
import AppHeader from './AppHeader/index.vue'
import AppMenu from './AppMenu/index.vue'
import AppTabs from './AppTabs/index.vue'
import { checkStatus } from '@/utils/http/helper'

const isCollapsed = ref(false)

const value = ref(new Date())

const handleError = () => {
  checkStatus(404, '资源未找到')
}
</script>

<template>
  <el-container>
    <el-aside width="auto">
      <app-menu v-model:collapse="isCollapsed" />
    </el-aside>
    <el-container>
      <el-header>
        <app-header v-model:collapse="isCollapsed" />
      </el-header>
      <app-tabs></app-tabs>
      <el-main class="text-center">
        <router-view />
        <el-button type="success"
          ><i-ep-SuccessFilled />{{ $t('sys.api.successTip') }}</el-button
        >
        <el-button type="info"
          ><i-ep-InfoFilled />{{ $t('routes.basic.login') }}</el-button
        >
        <el-button type="warning"><i-ep-WarningFilled />Warning</el-button>

        <el-button type="danger" @click="handleError"
          ><div class="i-guidance:danger-poison text-2xl"></div
        ></el-button>

        <el-calendar v-model="value" mt-15 />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-header {
  display: flex;
  align-items: center;

  /* justify-content: space-between;
  color: #333;
  background-color: #fff; */
}
//  #001529 #304156
.el-aside {
  min-width: 210px;
  color: #333;
  background-color: #001529;
}

.el-main {
  color: #333;
  background-color: #e9eef3;
}
</style>
@/utils/http/helper
