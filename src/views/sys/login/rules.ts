import type { FormRules } from 'element-plus'
import { useLocale } from '@/locales/useLocale'

const { t } = useLocale()
/** 6位数字验证码正则 */
export const REGEXP_SIX = /^\d{6}$/

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/

/** 登录校验 */
const loginRules = reactive<FormRules>({
  password: [
    {
      validator: (rule, value, callback) => {
        console.log('output->', rule)
        if (value === '')
          callback(new Error(t('sys.login.passwordPlaceholder')))
        else if (!REGEXP_PWD.test(value))
          callback(new Error(t('sys.login.passwordRuleReg')))
        else callback()
      },
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        console.log('output->', rule)
        if (value === '') callback(new Error(t('sys.login.verifyCodeReg')))
        /// Todo: 验证码是否正确
        // else if (useUserStoreHook().verifyCode !== value)
        else if (value === '')
          callback(new Error(t('sys.login.verifyCodeCorrectReg')))
        else callback()
      },
      trigger: 'blur',
    },
  ],
})

export { loginRules }
