export const useCountStore = defineStore(
  'auth',
  () => {
    const captcha = ref({})

    return { captcha }
  },
  {
    persist: true,
  }
)
