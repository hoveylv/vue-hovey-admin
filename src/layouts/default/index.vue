<script setup lang="ts">
import { useCountStore } from '@/store/modules/count'

const store = useCountStore()

const value = ref(new Date())

const alert = () => {
  ElMessage({
    showClose: true,
    message: 'test',
    type: 'success',
  })
}
</script>
<template>
  <el-button @click="alert">-</el-button>
  {{ store.count }}<input v-model="store.count" type="number" />
  <button @click="store.count++">+</button>
  <lang-select></lang-select>
  <el-calendar v-model="value" />

  <router-view></router-view>
</template>
