<script setup lang="ts">
import { loginApi } from '@/api/sys/user'
import type { LoginResultModel } from '@/api/sys/model/userModel'

const user = ref<LoginResultModel>()

const handleError = async () => {
  user.value = await loginApi({
    username: 'hovey',
    password: '123456',
  })
}
</script>

<template>
  <div bg="blueGray" text-center>
    <div>{{ user?.userId }}</div>
    <div>{{ user?.role }}</div>
    <div>{{ user?.token }}</div>
    <div>
      <el-button type="danger" class="w-full" @click="handleError"
        ><div class="i-guidance:danger-poison text-2xl"></div
      ></el-button>
    </div>
  </div>
</template>
